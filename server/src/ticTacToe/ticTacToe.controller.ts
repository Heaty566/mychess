import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

//---- Service
import { SmailService } from '../providers/smail/smail.service';
import { SmsService } from '../providers/sms/sms.service';
import { UserService } from '../users/user.service';

import { RedisService } from '../providers/redis/redis.service';

//---- Entity
import { User } from '../users/entities/user.entity';

//---- Pipe
import { v4 as uuidv4 } from 'uuid';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';
import { config } from '../config';
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeService } from './ticTacToe.service';
import { UserGuard } from '../auth/auth.guard';
import { TicTacToeGateway } from './ticTacToe.gateway';
import { TicTacToeBotService } from './ticTacToeBot.service';

@Controller('tic-tac-toe')
export class TicTacToeController {
      constructor(
            private readonly redisService: RedisService,
            private readonly ticTacToeCommonService: TicTacToeCommonService,
            private readonly ticTacToeService: TicTacToeService,
            private readonly ticTacToeGateway: TicTacToeGateway,
            private readonly ticTacToeBotService: TicTacToeBotService,
      ) {}

      private async isPlaying(userId: string) {
            const isPlaying = await this.ticTacToeCommonService.isPlaying(userId);
            if (isPlaying) throw apiResponse.sendError({ details: { message: { type: 'game.already-join-other' } } }, 'BadRequestException');
      }

      @Post('/')
      @UseGuards(UserGuard)
      async handleOnCreateGame(@Req() req: Request) {
            await this.isPlaying(req.user.id);
            const board = await this.ticTacToeCommonService.createNewGame(req.user, false);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/create-bot')
      @UseGuards(UserGuard)
      async handleOnCreateGameWithBot(@Req() req: Request) {
            await this.isPlaying(req.user.id);

            const board = await this.ticTacToeCommonService.createNewGame(req.user, true);
            const bot = this.ticTacToeBotService.getBotInfo();
            board.currentTurn = false;
            board.info.users = [bot, req.user];
            board.users[0].ready = true;
            board.users[1].ready = true;
            board.users[0].id = uuidv4();
            await this.ticTacToeCommonService.setBoard(board.id, board);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/join-room')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdDto))
      async handleJoinRoom(@Req() req: Request, @Body() body: RoomIdDTO) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExistUser = await this.ticTacToeCommonService.isExistUser(board, req.user.id);
            if (!isExistUser) {
                  const isFull = board.info.users.length >= 2;
                  if (isFull) throw apiResponse.sendError({ details: { roomId: { type: 'game.full-player' } } }, 'BadRequestException');

                  board.info.users.push(req.user);
                  await this.ticTacToeCommonService.setBoard(board.id, board);

                  if (board.info.users.length === 2 && !board.isBotMode) this.ticTacToeService.loadUser(board);
            }
            await this.ticTacToeGateway.sendToRoom(board);
            return apiResponse.send<void>({});
      }
}
