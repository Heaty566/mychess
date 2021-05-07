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
            if (isPlaying) throw apiResponse.sendError({ details: { messageError: { type: 'error.already-join' } } }, 'BadRequestException');
      }

      @Post('/')
      @UseGuards(UserGuard)
      async handleOnCreateGame(@Req() req: Request) {
            await this.isPlaying(req.user.id);
            const board = await this.chessCommonService.createNewGame(req.user, false);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }
}
