import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeService } from './ticTacToe.service';
import { TicTacToeStatus } from './entity/ticTacToeStatus';
import { TicTacToe } from './entity/ticTacToe.entity';
import { ApiResponseBody } from '../app/interface/serverResponse';

@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway {
      constructor(private readonly ticTacToeService: TicTacToeService) {}

      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage('player-create-match')
      async handleCreateMatch(@ConnectedSocket() client: SocketExtend): Promise<WsResponse<ApiResponseBody<null>>> {
            const currentPlay = await this.ticTacToeService.getMatchByQuery('status = :status and user.id = :userId', {
                  status: TicTacToeStatus.PLAYING,
                  userId: client.user.id,
            });
            if (currentPlay.length) return { event: 'player-create-match-failed', data: { details: { message: { type: 'user.not-allow-action' } } } };
            const tic = new TicTacToe();
            tic.users = [client.user];
            const insertTic = await this.ticTacToeService.saveTicTacToe(tic);
            await client.join(`tic-tac-toe-${insertTic.id}`);

            return { event: 'player-create-match-success', data: {} };
      }
}
