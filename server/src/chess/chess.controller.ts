import { Body, Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Request } from 'express';

//---- Service
import { ChessService } from './chess.service';
import { RedisService } from '../providers/redis/redis.service';
import { ChessCommonService } from './chessCommon.service';
import { UserGuard } from '../auth/auth.guard';

//---- Gateway
import { ChessGateway } from './chess.gateway';

//---- Entity

//---- Pipe
import { v4 as uuidv4 } from 'uuid';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';

@Controller('chess')
export class ChessController {
      constructor(
            private readonly redisService: RedisService,
            private readonly chessCommonService: ChessCommonService,
            private readonly chessService: ChessService,
            private readonly chessGateway: ChessGateway,
      ) {}

      private async isPlaying(userId: string) {
            const isPlaying = await this.chessCommonService.isPlaying(userId);
            if (isPlaying) throw apiResponse.sendError({ details: { message: { type: 'game.already-join-other' } } }, 'BadRequestException');
      }

      @Post('/')
      @UseGuards(UserGuard)
      async handleOnCreateGame(@Req() req: Request) {
            await this.isPlaying(req.user.id);
            const board = await this.chessCommonService.createNewGame(req.user, false);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/join-room')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdDto))
      async handleJoinRoom(@Req() req: Request, @Body() body: RoomIdDTO) {
            const board = await this.chessCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExistUser = await this.chessCommonService.isExistUser(board, req.user.id);
            if (!isExistUser) {
                  const isFull = board.info.users.length >= 2;
                  if (isFull) throw apiResponse.sendError({ details: { roomId: { type: 'game.full-player' } } }, 'BadRequestException');

                  board.info.users.push(req.user);
                  await this.chessCommonService.setBoard(board.id, board);

                  if (board.info.users.length === 2 && !board.isBotMode) this.ticTacToeService.loadUser(board);
            }
            await this.ticTacToeGateway.sendToRoom(board);
            return apiResponse.send<void>({});
      }
}
