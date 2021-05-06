import { Body, Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Request } from 'express';

//---- Service
import { TicTacToeBotService } from './ticTacToeBot.service';
import { RedisService } from '../providers/redis/redis.service';
import { TicTacToeCommonService } from './ticTacToeCommon.service';
import { TicTacToeService } from './ticTacToe.service';
import { UserGuard } from '../auth/auth.guard';

//---- Gateway
import { TicTacToeGateway } from './ticTacToe.gateway';

//---- Entity

//---- Pipe
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';
import { RoomIdDTO, vRoomIdDto } from './dto/roomIdDto';
import { AddMoveDto, vAddMoveDto } from './dto/addMoveDto';
import { TicTacToeStatus } from './entity/ticTacToe.interface';

@Controller('ttt')
export class TicTacToeController {
      constructor(
            private readonly redisService: RedisService,
            private readonly ticTacToeCommonService: TicTacToeCommonService,
            private readonly ticTacToeService: TicTacToeService,
            private readonly ticTacToeGateway: TicTacToeGateway,
            private readonly ticTacToeBotService: TicTacToeBotService,
      ) {}

      @Post('/pvp')
      @UseGuards(UserGuard)
      async handleOnCreatePvP(@Req() req: Request) {
            const newGameId = await this.ticTacToeService.createNewGame(req.user, false);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Post('/restart')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdDto))
      async handleOnRestartPvP(@Req() req: Request, @Body() body: RoomIdDTO) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExist = await this.ticTacToeCommonService.isExistUser(board.id, req.user.id);
            if (!isExist) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-allow-action' } } }, 'UnauthorizedException');
            const newGameId = await this.ticTacToeService.createNewGame(req.user, false);

            await this.ticTacToeGateway.restartGame(board.id, newGameId);
            return apiResponse.send<RoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Post('/bot')
      @UseGuards(UserGuard)
      async handleOnCreateBot(@Req() req: Request) {
            const newGameId = await this.ticTacToeService.createNewGame(req.user, true);
            const playerOne = await this.ticTacToeService.findUser(newGameId, req.user.id);
            const bot = await this.ticTacToeService.findUser(newGameId, 'BOT');
            await this.ticTacToeService.toggleReadyStatePlayer(newGameId, playerOne);
            await this.ticTacToeService.toggleReadyStatePlayer(newGameId, bot);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Post('/join-room')
      @UseGuards(UserGuard)
      async handleOnJoinRoom(@Req() req: Request, @Body() body: RoomIdDTO) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');
            if (board.status !== TicTacToeStatus['NOT-YET'])
                  throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExist = await this.ticTacToeCommonService.isExistUser(board.id, req.user.id);
            if (!isExist && board.users.length < 2) await this.ticTacToeService.joinGame(board.id, req.user);

            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/start')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdDto))
      async handleOnStartGame(@Req() req: Request, @Body() body: RoomIdDTO) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExist = await this.ticTacToeCommonService.isExistUser(board.id, req.user.id);
            if (!isExist) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-allow-action' } } }, 'UnauthorizedException');
            await this.ticTacToeService.startGame(board.id);

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/ready')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdDto))
      async handleOnReadyGame(@Req() req: Request, @Body() body: RoomIdDTO) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExist = await this.ticTacToeCommonService.isExistUser(board.id, req.user.id);
            if (!isExist) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-allow-action' } } }, 'UnauthorizedException');
            await this.ticTacToeService.toggleReadyStatePlayer(board.id, isExist);

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/leave')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vRoomIdDto))
      async handleOnLeaveGame(@Req() req: Request, @Body() body: RoomIdDTO) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const isExist = await this.ticTacToeCommonService.isExistUser(board.id, req.user.id);
            if (!isExist) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-allow-action' } } }, 'UnauthorizedException');
            await this.ticTacToeService.leaveGame(board.id, isExist);

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/add-move')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vAddMoveDto))
      async handleOnAddMoveGame(@Req() req: Request, @Body() body: AddMoveDto) {
            const board = await this.ticTacToeCommonService.getBoard(body.roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-found' } } }, 'NotFoundException');

            const player = await this.ticTacToeService.findUser(board.id, req.user.id);
            if (!player) throw apiResponse.sendError({ details: { roomId: { type: 'user.not-allow-action' } } }, 'UnauthorizedException');
            const isAdd = await this.ticTacToeService.addMoveToBoard(board.id, player, body.x, body.y);
            if (!isAdd) throw apiResponse.sendError({ details: { roomId: { type: 'game.wrong-turn' } } }, 'BadRequestException');
            const isWin = await this.ticTacToeService.isWin(board.id);
            if (board.isBotMode && !isWin) {
                  const userMove = await this.ticTacToeBotService.findBestMove(board.id, board.users[0]);
                  const botMove = await this.ticTacToeBotService.findBestMove(board.id, board.users[1]);
                  if (userMove.point >= botMove.point) await this.ticTacToeService.addMoveToBoard(board.id, board.users[1], userMove.x, userMove.y);
                  else await this.ticTacToeService.addMoveToBoard(board.id, board.users[1], botMove.x, botMove.y);
                  await this.ticTacToeService.isWin(board.id);
            }

            await this.ticTacToeGateway.sendToRoom(board.id);
            return apiResponse.send<RoomIdDTO>({ data: { roomId: board.id } });
      }
}
