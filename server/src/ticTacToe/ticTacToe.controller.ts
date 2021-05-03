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
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';
import { config } from '../config';
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeService } from './ticTacToe.service';
import { UserGuard } from '../auth/auth.guard';

@Controller('tic-tac-toe')
export class TicTacToeController {
      constructor(
            private readonly redisService: RedisService,
            private readonly ticTacToeCommonService: TicTacToeCommonService,
            private readonly ticTacToeService: TicTacToeService,
      ) {}

      @Post('/check-room')
      @UsePipes(new JoiValidatorPipe(vRoomIdDto))
      async checkExistRoom(@Body() body: RoomIdDTO) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');
            if (board.info.users.length === 2)
                  throw apiResponse.sendError({ details: { roomId: { type: 'game.full-player' } } }, 'BadRequestException');

            return apiResponse.send<void>({});
      }

      @Post('/')
      @UseGuards(UserGuard)
      async createNewRoom(@Req() req: Request) {
            const isPlaying = await this.ticTacToeCommonService.isPlaying(req.user.id);
            if (isPlaying) throw apiResponse.sendError({ details: { message: { type: 'game.already-join-other' } } }, 'BadRequestException');

            const newGameId = await this.ticTacToeCommonService.createNewGame(req.user);
            await this.ticTacToeService.loadGameToCache(newGameId);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: newGameId } });
      }
}
