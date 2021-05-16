import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, SocketExtend } from 'socket.io';

//---- Pipe
import { SocketJoiValidatorPipe } from '../utils/validator/socketValidator.pipe';

//---- Service
import { UserSocketGuard } from '../auth/authSocket.guard';
import { TicTacToeCommonService } from './ticTacToeCommon.service';

//---- Entity

//---- Dto
import { TTTRoomIdDTO, vTTTRoomIdDto } from './dto/tttRoomIdDto';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { TTTGatewayAction } from './ticTacToeGateway.action';
import { TicTacToeStatus } from './entity/ticTacToe.interface';

@WebSocketGateway({ namespace: 'tic-tac-toe' })
export class TicTacToeGateway implements OnGatewayDisconnect {
      constructor(private readonly ticTacToeCommonService: TicTacToeCommonService) {}

      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      private async isExistUser(boardId: string, userId: string) {
            const getUser = await this.ticTacToeCommonService.findUser(boardId, userId);
            if (!getUser) throw ioResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'UnauthorizedException');
      }

      async sendToRoom(boardId: string) {
            const board = await this.ticTacToeCommonService.getBoard(boardId);
            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_GET, boardId, { data: board }, 'ttt');
      }

      async restartGame(boardId: string, newBoardId: string) {
            const board = await this.ticTacToeCommonService.getBoard(newBoardId);

            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_RESTART, boardId, { data: board }, 'ttt');
      }

      private async getGameFromCache(roomId: string) {
            const game = await this.ticTacToeCommonService.getBoard(roomId);
            if (!game) throw ioResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');

            return game;
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_JOIN)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vTTTRoomIdDto)) body: TTTRoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            await this.isExistUser(body.roomId, client.user.id);
            await client.join(`ttt-${getCacheGame.id}`);
            client.user.games.tttId = getCacheGame.id;

            return this.socketServer().socketEmitToRoom<TTTRoomIdDTO>(TTTGatewayAction.TTT_JOIN, getCacheGame.id, {}, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_GET)
      async handleGetGame(@MessageBody(new SocketJoiValidatorPipe(vTTTRoomIdDto)) body: TTTRoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);

            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_GET, getCacheGame.id, { data: getCacheGame }, 'ttt');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(TTTGatewayAction.TTT_COUNTER)
      async handleGetTime(@MessageBody(new SocketJoiValidatorPipe(vTTTRoomIdDto)) body: TTTRoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            if (getCacheGame.status === TicTacToeStatus.PLAYING) {
                  const currentFlag = getCacheGame.currentTurn ? 0 : 1;
                  const currentTime = new Date().getTime();
                  getCacheGame.users[currentFlag].time -= currentTime - new Date(getCacheGame.lastStep).getTime();

                  if (getCacheGame.users[currentFlag].time <= 0) {
                        await this.ticTacToeCommonService.surrender(getCacheGame.id, getCacheGame.users[currentFlag]);
                        await this.sendToRoom(getCacheGame.id);
                  }
            }
            return this.socketServer().socketEmitToRoom(TTTGatewayAction.TTT_COUNTER, getCacheGame.id, { data: getCacheGame.users }, 'ttt');
      }

      async handleDisconnect(@ConnectedSocket() client: SocketExtend) {
            if (client.user?.games?.tttId) {
                  const boardId = client.user.games.tttId;
                  const user = await this.ticTacToeCommonService.findUser(boardId, client.user.id);
                  if (user) {
                        await this.ticTacToeCommonService.leaveGame(boardId, user);
                        await this.sendToRoom(boardId);
                        await client.leave(`ttt-${boardId}`);
                  }
            }
      }
}
