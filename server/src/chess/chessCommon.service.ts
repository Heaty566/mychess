import { Injectable } from '@nestjs/common';
import { ChessRepository } from './entity/chess.repository';
import { ChessPlayer, ChessStatus, PlayerFlagEnum } from './entity/chess.interface';
import { Chess } from './entity/chess.entity';
import { User } from '../user/entities/user.entity';
import { ChessBoard } from './entity/chessBoard.entity';
import { RedisService } from '../utils/redis/redis.service';
import { ObjectLiteral } from 'typeorm';
import { UserService } from '../user/user.service';
import { ChessMoveRepository } from './entity/chessMove.repository';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class ChessCommonService {
      constructor(
            private readonly chessRepository: ChessRepository,
            private readonly redisService: RedisService,
            private readonly userService: UserService,
            private readonly chatService: ChatService,
            private readonly chessMoveRepository: ChessMoveRepository,
      ) {}

      async getManyChessByQuery(where: string, parameters: ObjectLiteral) {
            const res = await this.chessRepository.getManyChessByField(where, parameters);
            return res;
      }

      async getOneChessByField(where: string, parameters: ObjectLiteral) {
            const res = await this.chessRepository.getOneChessByFiled(where, parameters);
            return res;
      }

      async isPlaying(userId: string) {
            const currentPlay = await this.chessRepository.getManyChessByField('chess.status = :status', {
                  status: ChessStatus.PLAYING,
                  userId,
            });

            return Boolean(currentPlay.length);
      }

      async createNewGame(user: User, isBotMode?: boolean) {
            const chess = new Chess();
            const chat = await this.chatService.createChat(user);
            chess.chatId = chat.id;

            const chessBoard = new ChessBoard();
            chessBoard.initBoard();
            chessBoard.chatId = chat.id;

            await this.setBoard(chessBoard);

            await this.joinGame(chessBoard.id, user);

            return chessBoard.id;
      }

      async setBoard(board: ChessBoard) {
            await this.redisService.setObjectByKey(`chess-${board.id}`, board, 120);
      }

      async getBoard(boardId: string) {
            const board = await this.redisService.getObjectByKey<ChessBoard>(`chess-${boardId}`);
            return board;
      }

      async isExistUser(boardId: string, userId: string) {
            const board = await this.getBoard(boardId);
            const user = board.users.find((item) => item.id === userId);
            return user;
      }

      async joinGame(boardId: string, user: User | ChessPlayer) {
            const board = await this.getBoard(boardId);
            if (board?.users && user && board.users.length < 2) {
                  const userFlag = board.users.length === 0 ? PlayerFlagEnum.WHITE : PlayerFlagEnum.BLACK;

                  board.users.push({
                        username: user?.username,
                        name: user?.name,
                        avatarUrl: user?.avatarUrl,
                        elo: user?.elo,
                        time: 90000,
                        id: user?.id,
                        ready: false,
                        flag: userFlag,
                  });

                  await this.setBoard(board);
                  return true;
            }
            return false;
      }

      async startGame(boardId: string) {
            const board = await this.getBoard(boardId);

            if (board && board.users[0]?.ready && board.users[1]?.ready) {
                  board.status = ChessStatus.PLAYING;
                  board.startDate = new Date();

                  await this.setBoard(board);
                  return true;
            }
            return false;
      }

      async surrender(boardId: string, surrenderPlayer: ChessPlayer) {
            const board = await this.getBoard(boardId);
            if (board) {
                  board.winner = surrenderPlayer.flag === PlayerFlagEnum.WHITE ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;
                  board.status = ChessStatus.END;
                  await this.setBoard(board);
                  await this.saveChessFromCacheToDb(boardId);
            }
      }

      async saveChessFromCacheToDb(boardId: string) {
            const board = await this.getBoard(boardId);
            if (board && board.status === ChessStatus.END) {
                  const chess = await this.saveChess(board);
                  return chess;
            }
      }

      async saveChess(board: ChessBoard) {
            //
      }

      async saveChessMove(board: ChessBoard) {
            //
      }

      async leaveGame(boardId: string, player: ChessPlayer) {
            //
      }

      async toggleReadyStatePlayer(boardId: string, player: ChessPlayer) {
            const board = await this.getBoard(boardId);
            board.users[player.flag].ready = !board.users[player.flag].ready;
            await this.setBoard(board);
      }
}
