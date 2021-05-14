import { Injectable } from '@nestjs/common';
import { ChessRepository } from './entity/chess.repository';
import { ChessPlayer, ChessStatus, EloCalculator, PlayerFlagEnum } from './entity/chess.interface';
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

      async getAllBoardByUserId(userId: string) {
            const chesses = await this.chessRepository
                  .createQueryBuilder('chess')
                  .leftJoinAndSelect('chess.users', 'user')
                  .where(`user.id = :userId`, { userId })
                  .getMany();

            if (!chesses.length) return { boards: [], count: 0, totalWin: 0 };
            const chessIds = chesses.map((chess) => chess.id);

            const board = await this.chessRepository
                  .getBoardQuery()
                  .where(`chess.id in (:...values)`, { values: chessIds })
                  .orderBy('chess.startDate', 'DESC');

            const boards = await board.getMany();
            const totalWin = boards.filter((item) => item.winner !== PlayerFlagEnum.EMPTY && item.users[item.winner].id === userId).length;

            const count = boards.length;
            const result = boards.splice(0, 6);
            return { boards: result, count, totalWin };
      }

      async getManyChessByQuery(where: string, parameters: ObjectLiteral) {
            const res = await this.chessRepository.getManyChessByField(where, parameters);
            return res;
      }

      async getOneChessByField(where: string, parameters: ObjectLiteral) {
            const res = await this.chessRepository.getOneChessByFiled(where, parameters);
            return res;
      }

      async createNewGame(user: User, isBotMode = false) {
            const chess = new Chess();
            const chat = await this.chatService.createChat(user);
            chess.chatId = chat.id;

            const chessBoard = new ChessBoard(isBotMode);
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
                        username: user.username,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                        elo: user.elo,
                        time: 900000,
                        id: user.id,
                        ready: false,
                        flag: userFlag,
                        isDraw: false,
                  });

                  await this.setBoard(board);
                  return true;
            }
            return false;
      }

      async startGame(boardId: string) {
            const board = await this.getBoard(boardId);

            if (board && board.users[0].ready && board.users[1].ready) {
                  board.status = ChessStatus.PLAYING;
                  board.startDate = new Date();
                  board.lastStep = new Date();
                  await this.setBoard(board);
                  return true;
            }
            return false;
      }

      async surrender(boardId: string, surrenderPlayer: ChessPlayer) {
            const board = await this.getBoard(boardId);
            if (board) {
                  board.winner = surrenderPlayer.flag === PlayerFlagEnum.WHITE ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;
                  const eloCalculator = this.calculateElo(board.winner, board.users[0], board.users[1]);
                  board.users[0].elo += eloCalculator.whiteElo;
                  board.users[1].elo += eloCalculator.blackElo;
                  board.eloBlackUser = eloCalculator.blackElo;
                  board.eloWhiteUser = eloCalculator.whiteElo;
                  board.status = ChessStatus.END;
                  await this.setBoard(board);
                  await this.saveChessFromCacheToDb(boardId);
            }
      }

      async draw(boardId: string, isDraw: boolean) {
            const board = await this.getBoard(boardId);
            if (board) {
                  if (isDraw) {
                        board.winner = PlayerFlagEnum.EMPTY;
                        board.status = ChessStatus.END;
                        const eloCalculator = this.calculateElo(board.winner, board.users[0], board.users[1]);
                        board.users[0].elo += eloCalculator.whiteElo;
                        board.users[1].elo += eloCalculator.blackElo;
                        board.eloBlackUser = eloCalculator.blackElo;
                        board.eloWhiteUser = eloCalculator.whiteElo;
                        await this.setBoard(board);
                        await this.saveChessFromCacheToDb(boardId);
                  } else {
                        board.status = ChessStatus.PLAYING;
                        await this.setBoard(board);
                  }
            }
            return false;
      }

      async createDrawRequest(boardId: string, player: ChessPlayer) {
            const board = await this.getBoard(boardId);
            board.status = ChessStatus.DRAW;
            board.users[player.flag].isDraw = true;
            await this.setBoard(board);
      }

      async saveChessFromCacheToDb(boardId: string) {
            const board = await this.getBoard(boardId);
            if (board && board.status === ChessStatus.END) {
                  const chess = await this.saveChess(board);
                  return chess;
            }
      }

      async saveChess(board: ChessBoard) {
            const users = await this.userService.findManyUserByArrayField('id', [board.users[0].id, board.users[1].id]);
            const chat = await this.chatService.saveChat(board.chatId);
            const moves = await this.saveChessMove(board);

            const newChess = new Chess();
            newChess.users = users;
            newChess.winner = board.winner;
            newChess.chatId = chat.id;
            newChess.moves = moves;
            newChess.eloBlackUser = board.eloBlackUser;
            newChess.eloWhiteUser = board.eloWhiteUser;
            newChess.endDate = new Date();

            const chess = await this.chessRepository.save(newChess);
            return chess;
      }

      async saveChessMove(board: ChessBoard) {
            board.moves.forEach(async (move) => await this.chessMoveRepository.save(move));
            return board.moves;
      }

      async leaveGame(boardId: string, player: ChessPlayer) {
            const board = await this.getBoard(boardId);
            if (board) {
                  if (board.status === ChessStatus.PLAYING) {
                        await this.surrender(boardId, player);
                        return true;
                  } else if (board.status === ChessStatus.NOT_YET) {
                        const remainUser = board.users.find((item) => item.id !== player.id);
                        board.users = [];
                        await this.setBoard(board);
                        await this.joinGame(board.id, remainUser);
                        return true;
                  }
            }
      }

      async toggleReadyStatePlayer(boardId: string, player: ChessPlayer) {
            const board = await this.getBoard(boardId);
            board.users[player.flag].ready = !board.users[player.flag].ready;
            await this.setBoard(board);
      }

      calculateElo(result: PlayerFlagEnum, playerWhite: ChessPlayer, playerBlack: ChessPlayer): EloCalculator {
            const Qw = Math.pow(10, playerWhite.elo / 400);
            const Qb = Math.pow(10, playerBlack.elo / 400);

            const Ew = Qw / (Qw + Qb);
            const Eb = Qb / (Qw + Qb);

            let Kw, Kb;
            if (Kw < 1600) Kw = 25;
            else if (Kw < 2000) Kw = 20;
            else if (Kw < 2400) Kw = 15;
            else Kw = 10;
            if (Kw < 1600) Kb = 25;
            else if (Kw < 2000) Kb = 20;
            else if (Kw < 2400) Kb = 15;
            else Kb = 10;

            let Aw, Ab;
            if (result === PlayerFlagEnum.WHITE) {
                  Aw = 1;
                  Ab = 0;
            } else if (result === PlayerFlagEnum.BLACK) {
                  Aw = 0;
                  Ab = 1;
            } else if (result === PlayerFlagEnum.EMPTY) {
                  Aw = 0;
                  Ab = 0;
            }

            return {
                  whiteElo: Math.floor(Kw * (Aw - Ew)),
                  blackElo: Math.floor(Kb * (Ab - Eb)),
            };
      }

      async restartGame(boardId: string) {
            const board = await this.getBoard(boardId);

            const player1 = board.users[0];
            const player2 = board.users[1];

            const user1 = await this.userService.findOneUserByField('id', player1.id);
            const user2 = await this.userService.findOneUserByField('id', player2.id);

            const newBoardId = await this.createNewGame(user2, false);
            await this.joinGame(newBoardId, user1);

            return newBoardId;
      }
}
