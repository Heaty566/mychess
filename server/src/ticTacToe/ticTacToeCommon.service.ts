import { Injectable } from '@nestjs/common';

//---- Service
import { RedisService } from '../providers/redis/redis.service';
import { UserService } from '../users/user.service';

//---- Entity
import { TicTacToe } from './entity/ticTacToe.entity';
import User from '../users/entities/user.entity';
import { TicTacToeFlag, TicTacToePlayer, TicTacToeStatus } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';
import { TicTacToeMove } from './entity/ticTacToeMove.entity';

//---- Repository
import { TicTacToeRepository } from './entity/ticTacToe.repository';

@Injectable()
export class TicTacToeCommonService {
      constructor(
            private readonly ticTacToeRepository: TicTacToeRepository,
            private readonly redisService: RedisService,
            private readonly userService: UserService,
      ) {}

      async getBoard(boardId: string) {
            const newBoardId = `ttt-${boardId}`;
            const board = await this.redisService.getObjectByKey<TicTacToeBoard>(newBoardId);

            return board;
      }

      async setBoard(board: TicTacToeBoard) {
            const boardId = `ttt-${board.id}`;

            return await this.redisService.setObjectByKey(boardId, board, 1440);
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
            await this.setBoard(newBoard);

            await this.joinGame(newBoard.id, user);
            if (isBotMode) {
                  const bot = this.getBotInfo();
                  await this.joinGame(newBoard.id, bot);
            }

            return newBoard.id;
      }
      async joinGame(boardId: string, user: User | TicTacToePlayer) {
            const board = await this.getBoard(boardId);

            if (board?.users && board.users.length !== 2) {
                  const userFlag = board.users.length === 0 ? TicTacToeFlag.BLUE : TicTacToeFlag.RED;

                  board.users.push({
                        username: user.username,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                        elo: user.elo,
                        time: 90000,
                        id: user.id,
                        ready: false,
                        flag: userFlag,
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

                  await this.setBoard(board);
                  await this.loadToDatabase(boardId);
            }
      }

      async loadToDatabase(boardId: string) {
            const board = await this.getBoard(boardId);
            if (board && !board.isBotMode && board.status === TicTacToeStatus.END) {
                  const moves: Array<TicTacToeMove> = [];
                  const users = await this.userService.findManyUserByArrayField('id', [board.users[0].id, board.users[1].id]);

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

                  const newTicTacToe = new TicTacToe();
                  newTicTacToe.endDate = new Date();
                  newTicTacToe.moves = moves;
                  newTicTacToe.winner = board.winner;
                  newTicTacToe.users = users;
                  newTicTacToe.startDate = board.startDate;
                  return await this.ticTacToeRepository.save(newTicTacToe);
            }
      }
}
