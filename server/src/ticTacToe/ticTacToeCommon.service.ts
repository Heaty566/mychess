import { Injectable } from '@nestjs/common';

//---- Service
import { RedisService } from '../utils/redis/redis.service';
import { UserService } from '../user/user.service';

//---- Entity
import { TicTacToe } from './entity/ticTacToe.entity';
import { User } from '../user/entities/user.entity';
import { ChatService } from '../chat/chat.service';
import { TicTacToeFlag, TicTacToePlayer, TicTacToeStatus, EloCalculator } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { TicTacToeMove } from './entity/ticTacToeMove.entity';

//---- Repository
import { TicTacToeRepository } from './entity/ticTacToe.repository';
import { TicTacToeMoveRepository } from './entity/ticTacToeMove.repository';

@Injectable()
export class TicTacToeCommonService {
      constructor(
            private readonly ticTacToeRepository: TicTacToeRepository,
            private readonly ticTacToeMoveRepository: TicTacToeMoveRepository,
            private readonly redisService: RedisService,
            private readonly userService: UserService,
            private readonly chatService: ChatService,
      ) {}

      async getAllBoardByUserId(userId: string) {
            const chesses = await this.ticTacToeRepository
                  .createQueryBuilder('tic')
                  .leftJoinAndSelect('tic.users', 'user')
                  .where(`user.id = :userId`, { userId })
                  .getMany();

            if (!chesses.length) return { boards: [], count: 0, totalWin: 0 };
            const chessIds = chesses.map((chess) => chess.id);

            const board = await this.ticTacToeRepository
                  .getBoardQuery()
                  .where(`tic.id in (:...values)`, { values: chessIds })
                  .orderBy('tic.startDate', 'DESC');

            const boards = await board.getMany();
            const totalWin = boards.filter((item) => item.winner !== TicTacToeFlag.EMPTY && item.users[item.winner].id === userId).length;

            const count = boards.length;
            const result = boards.splice(0, 6);

            return { boards: result, count, totalWin };
      }

      async getBoard(boardId: string) {
            const newBoardId = `ttt-${boardId}`;
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(newBoardId);

            return board;
      }

      async setBoard(board: TicTacToeBoard) {
            const boardId = `ttt-${board.id}`;

            return await this.redisService.setObjectByKey(boardId, board, 120);
      }

      async isExistUser(boardId: string, userId: string) {
            const board = await this.getBoard(boardId);
            const user = board.users.find((item) => item.id === userId);
            return user;
      }

      async startGame(boardId: string) {
            const board = await this.getBoard(boardId);
            if (board && board.users[0].ready && board.users[1].ready) {
                  board.status = TicTacToeStatus.PLAYING;
                  board.startDate = new Date();
                  board.lastStep = new Date();

                  await this.setBoard(board);
                  return true;
            }
            return false;
      }

      async findUser(boardId: string, userId: string) {
            const board = await this.getBoard(boardId);
            if (board) {
                  const getUser = board.users.find((item) => item.id === userId);
                  return getUser;
            }
      }

      async createNewGame(user: User, isBotMode: boolean) {
            const newBoard = new TicTacToeBoard(isBotMode);
            const newChat = await this.chatService.createChat(user);
            newBoard.chatId = newChat.id;
            await this.setBoard(newBoard);
            await this.joinGame(newBoard.id, user);
            if (isBotMode) {
                  const bot = this.getBotInfo();
                  await this.joinGame(newBoard.id, bot);
            }

            return newBoard.id;
      }

      async createDrawRequest(boardId: string, player: TicTacToePlayer) {
            const board = await this.getBoard(boardId);
            board.status = TicTacToeStatus.DRAW;
            board.users[player.flag].isDraw = true;
            await this.setBoard(board);
      }

      async joinGame(boardId: string, user: User | TicTacToePlayer) {
            const board = await this.getBoard(boardId);

            if (board?.users && user && board.users.length !== 2) {
                  const userFlag = board.users.length === 0 ? TicTacToeFlag.BLUE : TicTacToeFlag.RED;

                  board.users.push({
                        username: user?.username,
                        name: user?.name,
                        avatarUrl: user?.avatarUrl,
                        elo: user?.elo,
                        time: 900000,
                        id: user?.id,
                        ready: false,
                        flag: userFlag,
                        isDraw: false,
                  });

                  await this.setBoard(board);
                  return true;
            }
            return false;
      }

      async toggleReadyStatePlayer(boardId: string, player: TicTacToePlayer) {
            const board = await this.getBoard(boardId);
            board.users[player.flag].ready = !board.users[player.flag].ready;
            await this.setBoard(board);
      }

      getBotInfo() {
            const user = new User();
            user.id = 'BOT';
            user.elo = 200;
            user.name = 'BOT';
            user.username = 'BOT';
            user.avatarUrl = this.userService.randomAvatar();

            return user;
      }

      async leaveGame(boardId: string, player: TicTacToePlayer) {
            const board = await this.getBoard(boardId);
            if (board) {
                  if (board.status === TicTacToeStatus.PLAYING) {
                        await this.surrender(boardId, player);
                        return true;
                  } else if (board.status === TicTacToeStatus['NOT-YET']) {
                        const remainUser = board.users.find((item) => item.id !== player.id);
                        board.users = [];
                        await this.setBoard(board);
                        await this.joinGame(board.id, remainUser);
                        return true;
                  }
            }
      }

      async surrender(boardId: string, player: TicTacToePlayer) {
            const board = await this.getBoard(boardId);
            if (board) {
                  board.winner = player.flag === TicTacToeFlag.BLUE ? TicTacToeFlag.RED : TicTacToeFlag.BLUE;
                  board.status = TicTacToeStatus.END;
                  const eloCalculator = this.calculateElo(board.winner, board.users[0], board.users[1]);

                  board.users[0].elo += eloCalculator.blueElo;
                  board.users[1].elo += eloCalculator.redElo;
                  board.eloBlueUser = eloCalculator.blueElo;
                  board.eloRedUser = eloCalculator.redElo;
                  await this.setBoard(board);
                  await this.saveTTTFromCacheToDb(boardId);
            }
      }

      async saveTTTFromCacheToDb(boardId: string) {
            const board = await this.getBoard(boardId);
            if (board && !board.isBotMode && board.status === TicTacToeStatus.END) {
                  const ttt = await this.saveTTT(board);
                  return ttt;
            }
      }

      async saveTTTMove(board: TicTacToeBoard) {
            const moves: Array<TicTacToeMove> = [];
            for (let i = 0; i < board.board.length; i++)
                  for (let j = 0; j < board.board[i].length; j++) {
                        if (board.board[i][j] !== -1) {
                              const updateMove = new TicTacToeMove();
                              updateMove.x = i;
                              updateMove.y = j;
                              updateMove.flag = board.board[i][j];
                              moves.push(updateMove);
                        }
                  }

            return await this.ticTacToeMoveRepository.save(moves);
      }

      async saveTTT(board: TicTacToeBoard) {
            const users = await this.userService.findManyUserByArrayField('id', [board.users[0].id, board.users[1].id]);
            const chat = await this.chatService.saveChat(board.chatId);
            const moves = await this.saveTTTMove(board);

            const newTicTacToe = new TicTacToe();
            newTicTacToe.endDate = new Date();
            newTicTacToe.moves = moves;
            newTicTacToe.winner = board.winner;
            newTicTacToe.users = users;
            newTicTacToe.startDate = board.startDate;
            newTicTacToe.blueElo = board.eloBlueUser;
            newTicTacToe.redElo = board.eloRedUser;
            newTicTacToe.chatId = chat.id;

            const ttt = await this.ticTacToeRepository.save(newTicTacToe);

            return ttt;
      }

      async draw(boardId: string, isDraw: boolean) {
            const board = await this.getBoard(boardId);

            if (board) {
                  if (isDraw) {
                        board.winner = TicTacToeFlag.EMPTY;
                        board.status = TicTacToeStatus.END;
                        const eloCalculator = this.calculateElo(board.winner, board.users[0], board.users[1]);
                        board.users[0].elo += eloCalculator.blueElo;
                        board.users[1].elo += eloCalculator.redElo;
                        board.eloBlueUser = eloCalculator.blueElo;
                        board.eloRedUser = eloCalculator.redElo;
                        await this.setBoard(board);
                        await this.saveTTTFromCacheToDb(boardId);
                  } else {
                        board.status = TicTacToeStatus.PLAYING;
                        await this.setBoard(board);
                  }
            }
      }

      calculateElo(result: TicTacToeFlag, playerBlue: TicTacToePlayer, playerRed: TicTacToePlayer): EloCalculator {
            const Qb = Math.pow(10, playerBlue.elo / 400);
            const Qr = Math.pow(10, playerRed.elo / 400);

            const Eb = Qb / (Qb + Qr);
            const Er = Qr / (Qb + Qr);

            let Kb, Kr;
            if (Kb < 1600) Kb = 25;
            else if (Kb < 2000) Kb = 20;
            else if (Kb < 2400) Kb = 15;
            else Kb = 10;
            if (Kb < 1600) Kr = 25;
            else if (Kb < 2000) Kr = 20;
            else if (Kb < 2400) Kr = 15;
            else Kr = 10;

            let Ab, Ar;
            if (result === TicTacToeFlag.BLUE) {
                  Ab = 1;
                  Ar = 0;
            } else if (result === TicTacToeFlag.RED) {
                  Ab = 0;
                  Ar = 1;
            } else if (result === TicTacToeFlag.EMPTY) {
                  Ab = 0;
                  Ar = 0;
            }

            return {
                  blueElo: Math.floor(Kb * (Ab - Eb)),
                  redElo: Math.floor(Kr * (Ar - Er)),
            };
      }
}
