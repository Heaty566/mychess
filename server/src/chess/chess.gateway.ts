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
export class TicTacToeGateway {
      constructor(private readonly chessService: ChessService, private readonly chessCommonService: ChessCommonService) {}

      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      private async isPlaying(userId: string) {
            const isPlaying = await this.chessCommonService.isPlaying(userId);
            if (isPlaying)
                  return this.socketServer().socketEmitToRoomError('BadRequestException', userId, {
                        details: { message: { type: 'game.already-join-other' } },
                  });
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(ChessAction.CHESS_CREATE)
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend) {
            await this.isPlaying(client.user.id);

            const newGameId = await this.chessCommonService.createNewGame(client.user);
            await client.join(`chess-${newGameId}`);

            await this.chessService.loadGameToCache(newGameId);
            await this.chessService.joinGame(newGameId, client.user);

            return this.socketServer().socketEmitToRoom<RoomIdDTO>(ChessAction.CHESS_CREATE, newGameId, { data: { roomId: newGameId } }, 'chess');
      }
}
