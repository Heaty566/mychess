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
import { ChessRole, ChessStatus } from './entity/chess.interface';

//---- Dto
import { ChessRoomIdDTO, vChessRoomIdDto } from './dto/chessRoomIdDto';

//---- Common
import { ioResponse } from '../app/interface/socketResponse';
import { ChessGatewayAction } from './chessGateway.action';

@WebSocketGateway({ namespace: 'chess' })
export class ChessGateway {
      constructor(private readonly chessService: ChessService, private readonly chessCommonService: ChessCommonService) {}

      @WebSocketServer()
      server: Server;

      socketServer = () => ioResponse.getSocketServer(this.server);

      async sendToRoom(boardId: string) {
            const board = await this.chessCommonService.getBoard(boardId);
            return this.socketServer().socketEmitToRoom(ChessGatewayAction.CHESS_GET, boardId, { data: board }, 'chess');
      }

      private async getGameFromCache(roomId: string) {
            const game = await this.chessCommonService.getBoard(roomId);
            if (!game) throw ioResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');

            return game;
      }

      private async isExistUser(boardId: string, userId: string) {
            const getUser = await this.chessCommonService.findUser(boardId, userId);
            if (!getUser) throw ioResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'UnauthorizedException');
      }

      async restartGame(boardId: string, newBoardId: string) {
            const board = await this.chessCommonService.getBoard(newBoardId);
            return this.socketServer().socketEmitToRoom(ChessGatewayAction.CHESS_RESTART, boardId, { data: board }, 'chess');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(ChessGatewayAction.CHESS_JOIN)
      async handleJoinMatch(@ConnectedSocket() client: SocketExtend, @MessageBody(new SocketJoiValidatorPipe(vChessRoomIdDto)) body: ChessRoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            await this.isExistUser(body.roomId, client.user.id);
            await client.join(`chess-${getCacheGame.id}`);
            client.user.games.chessId = getCacheGame.id;

            return this.socketServer().socketEmitToRoom<ChessRoomIdDTO>(ChessGatewayAction.CHESS_JOIN, getCacheGame.id, {}, 'chess');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(ChessGatewayAction.CHESS_GET)
      async handleGetGame(@MessageBody(new SocketJoiValidatorPipe(vChessRoomIdDto)) body: ChessRoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);

            return this.socketServer().socketEmitToRoom(ChessGatewayAction.CHESS_GET, getCacheGame.id, { data: getCacheGame }, 'chess');
      }

      promotePawn(boardId: string, userId: string) {
            const role = {
                  KNIGHT: ChessRole.KNIGHT,
                  BISHOP: ChessRole.BISHOP,
                  QUEEN: ChessRole.QUEEN,
                  ROOK: ChessRole.ROOK,
            };
            return this.socketServer().socketEmitToRoom(ChessGatewayAction.CHESS_PROMOTE_PAWN, boardId, { data: { role, userId } }, 'chess');
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(ChessGatewayAction.CHESS_COUNTER)
      async handleGetTime(@MessageBody(new SocketJoiValidatorPipe(vChessRoomIdDto)) body: ChessRoomIdDTO) {
            const getCacheGame = await this.getGameFromCache(body.roomId);
            if (getCacheGame.status === ChessStatus.PLAYING) {
                  const currentFlag = getCacheGame.turn ? 1 : 0;
                  const currentTime = new Date().getTime();
                  getCacheGame.users[currentFlag].time -= currentTime - new Date(getCacheGame.lastStep).getTime();
                  if (getCacheGame.users[currentFlag].time <= 0) {
                        await this.chessCommonService.surrender(getCacheGame.id, getCacheGame.users[currentFlag]);
                        await this.sendToRoom(getCacheGame.id);
                  }
            }
            return this.socketServer().socketEmitToRoom(ChessGatewayAction.CHESS_COUNTER, getCacheGame.id, { data: getCacheGame.users }, 'chess');
      }

      async handleDisconnect(@ConnectedSocket() client: SocketExtend) {
            if (client?.user?.games?.chessId) {
                  const boardId = client.user.games.chessId;
                  const user = await this.chessCommonService.findUser(boardId, client.user.id);

                  if (user) {
                        await this.chessCommonService.leaveGame(boardId, user);
                        await this.sendToRoom(boardId);
                        await client.leave(`chess-${boardId}`);
                  }
            }
      }
}
