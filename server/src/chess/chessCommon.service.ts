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
                  .take(6)
                  .getMany();

            if (!chesses.length) return { boards: [], count: 0 };
            const chessIds = chesses.map((chess) => chess.id);

            const board = await this.chessRepository
                  .getBoardQuery()
                  .where(`chess.id in (:...values)`, { values: chessIds })
                  .orderBy('chess.startDate', 'DESC');

            const boards = await board.getMany();
            const count = await board.getCount();

            return { boards, count };
      }

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
                  const eloCalculator = this.calculateElo(board.winner, board.users[0], board.users[1]);
                  board.users[0].elo += eloCalculator.whiteElo;
                  board.users[1].elo += eloCalculator.blackElo;
                  board.status = ChessStatus.END;
                  await this.setBoard(board);
                  await this.saveChessFromCacheToDb(boardId);
            }
      }

      async draw(boardId: string) {
            const board = await this.getBoard(boardId);
            if (board) {
                  board.winner = -1;
                  board.status = ChessStatus.END;
                  const eloCalculator = this.calculateElo(board.winner, board.users[0], board.users[1]);
                  board.users[0].elo += eloCalculator.whiteElo;
                  board.users[1].elo += eloCalculator.blackElo;
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
            const users = await this.userService.findManyUserByArrayField('id', [board.users[0].id, board.users[1].id]);
            const chat = await this.chatService.saveChat(board.chatId);
            const moves = await this.saveChessMove(board);

            const newChess = new Chess();
            newChess.whiteUser = users[0].id;
            newChess.blackUser = users[1].id;
            newChess.users = users;
            newChess.winner = board.winner;
            newChess.chatId = chat.id;
            newChess.moves = moves;
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
}
