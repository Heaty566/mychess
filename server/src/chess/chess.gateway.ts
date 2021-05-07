import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';

//---- Pipe
import { SocketJoiValidatorPipe } from '../utils/validator/socketValidator.pipe';

//---- Service
import { UserSocketGuard } from '../auth/authSocket.guard';
import { ChessService } from './chess.service';
import { ChessCommonService } from './chessCommon.service';

//---- Entity

//---- Dto
import { RoomIdDTO } from './dto/roomIdDto';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { ChessAction } from './chess.action';

@WebSocketGateway({ namespace: 'chess' })
export class ChessGateway {
      constructor(private readonly chessService: ChessService, private readonly chessCommonService: ChessCommonService) {}

      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      private async isPlaying(userId: string) {
            const isPlaying = await this.chessCommonService.isPlaying(userId);
            if (isPlaying)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', userId, {
                        details: { messageError: { type: 'error.already-join' } },
                  });
      }
}
