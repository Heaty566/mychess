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
import { ChessRoomIdDTO } from './dto/chessRoomIdDto';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { ChessAction } from './chess.action';

@WebSocketGateway({ namespace: 'chess' })
export class ChessGateway {
      constructor(private readonly chessService: ChessService, private readonly chessCommonService: ChessCommonService) {}

      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      async sendToRoom(boardId: string) {
            const board = await this.chessCommonService.getBoard(boardId);
            return this.socketServer().socketEmitToRoom(ChessAction.CHESS_GET, boardId, { data: board }, 'chess');
      }
}
