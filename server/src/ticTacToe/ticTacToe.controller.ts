import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Request } from 'express';

//---- Service
import { TicTacToeBotService } from './ticTacToeBot.service';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeService } from './ticTacToe.service';
import { UserGuard } from '../auth/auth.guard';

//---- Gateway
import { TicTacToeGateway } from './ticTacToe.gateway';

//---- Entity
import { TicTacToeStatus } from './entity/ticTacToe.interface';
import { TicTacToeBoard } from './entity/ticTacToeBoard.entity';

//---- Pipe
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Dto
import { TTTRoomIdDTO, vTTTRoomIdDto } from './dto/tttRoomIdDto';
import { TTTAddMoveDto, vTTTAddMoveDto } from './dto/tttAddMoveDto';
import { DrawDto, vDrawDto } from './dto/drawDto';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';

@Controller('ttt')
export class TicTacToeController {
      constructor(
            private readonly ticTacToeCommonService: TicTacToeCommonService,
            private readonly ticTacToeService: TicTacToeService,
            private readonly ticTacToeGateway: TicTacToeGateway,
            private readonly ticTacToeBotService: TicTacToeBotService,
      ) {}

      private async getPlayer(tttId: string, userId: string) {
            const player = await this.ticTacToeCommonService.findUser(tttId, userId);
            if (!player) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            return player;
      }

      private async getGame(roomId: string) {
            const board = await this.ticTacToeCommonService.getBoard(roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');
            return board;
      }

      private async isPlaying(board: TicTacToeBoard) {
            if (board.status === TicTacToeStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
      }

      @Get('/quick-join-room')
      @UseGuards(UserGuard)
      async handleOnQuickJoinRoom(@Req() req: Request) {
            const boardId = await this.ticTacToeCommonService.quickJoinRoom();
            if (!boardId) throw apiResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');
            const board = await this.getGame(boardId);

            const isExist = await this.ticTacToeCommonService.findUser(board.id, req.user.id);
            if (!isExist) await this.ticTacToeCommonService.joinGame(board.id, req.user);

            return apiResponse.send({ data: { roomId: board.id } });
      }

      @Get('/:id')
      async handleOnGameByUserId(@Param('id') id: string) {
            const result = await this.ticTacToeCommonService.getAllBoardByUserId(id);

            return apiResponse.send({ data: result });
      }

      @Post('/pvp')
      @UseGuards(UserGuard)
      async handleOnCreatePvP(@Req() req: Request) {
            const newGameId = await this.ticTacToeCommonService.createNewGame(req.user, false);

            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Post('/restart')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vTTTRoomIdDto))
      async handleOnRestartPvP(@Req() req: Request, @Body() body: TTTRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isPlaying(board);
            await this.getPlayer(board.id, req.user.id);

            const newGameId = await this.ticTacToeCommonService.restartGame(body.roomId);

            await this.ticTacToeGateway.restartGame(board.id, newGameId);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Post('/bot')
      @UseGuards(UserGuard)
      async handleOnCreateBot(@Req() req: Request) {
            const newGameId = await this.ticTacToeCommonService.createNewGame(req.user, true);
            const playerOne = await this.ticTacToeCommonService.findUser(newGameId, req.user.id);
            const bot = await this.ticTacToeCommonService.findUser(newGameId, 'BOT');
            await this.ticTacToeCommonService.toggleReadyStatePlayer(newGameId, playerOne);
            await this.ticTacToeCommonService.toggleReadyStatePlayer(newGameId, bot);

            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Put('/join-room')
      @UseGuards(UserGuard)
      async handleOnJoinRoom(@Req() req: Request, @Body() body: TTTRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            if (board.status !== TicTacToeStatus['NOT-YET'])
                  throw apiResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');

            const isExist = await this.ticTacToeCommonService.findUser(board.id, req.user.id);
            if (!isExist && board.users.length < 2) await this.ticTacToeCommonService.joinGame(board.id, req.user);

            return apiResponse.send({ data: board });
      }

      @Put('/start')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vTTTRoomIdDto))
      async handleOnStartGame(@Req() req: Request, @Body() body: TTTRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isPlaying(board);
            await this.getPlayer(board.id, req.user.id);
            const isStart = await this.ticTacToeCommonService.startGame(board.id);
            if (!isStart) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.wait-ready-player' } } }, 'BadRequestException');

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/ready')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vTTTRoomIdDto))
      async handleOnReadyGame(@Req() req: Request, @Body() body: TTTRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isPlaying(board);

            const player = await this.getPlayer(board.id, req.user.id);
            await this.ticTacToeCommonService.toggleReadyStatePlayer(board.id, player);

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/leave')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vTTTRoomIdDto))
      async handleOnLeaveGame(@Req() req: Request, @Body() body: TTTRoomIdDTO) {
            const board = await this.getGame(body.roomId);

            const player = await this.getPlayer(board.id, req.user.id);
            await this.ticTacToeCommonService.leaveGame(board.id, player);

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/add-move')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vTTTAddMoveDto))
      async handleOnAddMoveGame(@Req() req: Request, @Body() body: TTTAddMoveDto) {
            const board = await this.getGame(body.roomId);
            if (board.status !== TicTacToeStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            if (board.board[body.x][body.y] !== -1) throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            const player = await this.getPlayer(board.id, req.user.id);
            const isAdd = await this.ticTacToeService.addMoveToBoard(board.id, player, body.x, body.y);
            if (!isAdd) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.wrong-turn' } } }, 'BadRequestException');
            const isWin = await this.ticTacToeService.isWin(board.id);
            if (board.isBotMode && !isWin) {
                  const userMove = await this.ticTacToeBotService.findBestMove(board.id, board.users[0]);
                  const botMove = await this.ticTacToeBotService.findBestMove(board.id, board.users[1]);
                  if (userMove.point >= botMove.point) await this.ticTacToeService.addMoveToBoard(board.id, board.users[1], userMove.x, userMove.y);
                  else await this.ticTacToeService.addMoveToBoard(board.id, board.users[1], botMove.x, botMove.y);
                  await this.ticTacToeService.isWin(board.id);
            }

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/draw')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vTTTRoomIdDto))
      async handleOnDrawCreate(@Req() req: Request, @Body() body: TTTRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            const player = await this.getPlayer(board.id, req.user.id);

            await this.getPlayer(board.id, req.user.id);

            if (board.status !== TicTacToeStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            await this.ticTacToeCommonService.createDrawRequest(board.id, player);
            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/draw')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vDrawDto))
      async handleOnDraw(@Req() req: Request, @Body() body: DrawDto) {
            const board = await this.getGame(body.roomId);
            const player = await this.getPlayer(board.id, req.user.id);

            if (board.status !== TicTacToeStatus.DRAW)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } }, data: [] }, 'ForbiddenException');

            const remainderUser = board.users.filter((item) => item.id !== player.id);
            if (!remainderUser[0].isDraw)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } }, data: [] }, 'ForbiddenException');
            await this.ticTacToeCommonService.draw(board.id, body.isAccept);

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/surrender')
      @UseGuards(UserGuard)
      async handleOnSurrender(@Req() req: Request, @Body() body: TTTRoomIdDTO) {
            const board = await this.getGame(body.roomId);

            if (board.status !== TicTacToeStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-playing' } } }, 'ForbiddenException');

            const player = await this.getPlayer(board.id, req.user.id);

            await this.ticTacToeCommonService.surrender(board.id, player);

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<TTTRoomIdDTO>({ data: { roomId: board.id } });
      }
}
