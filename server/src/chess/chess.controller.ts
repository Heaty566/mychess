import { Body, Controller, Post, Put, Req, UseGuards, UsePipes, Get, Param } from '@nestjs/common';
import { Request } from 'express';

//---- Service
import { ChessService } from './chess.service';
import { ChessBotService } from './chessBot.service';
import { ChessCommonService } from './chessCommon.service';
import { UserGuard } from '../auth/auth.guard';

//---- Gateway
import { ChessGateway } from './chess.gateway';

//---- Entity
import { ChessStatus, PlayerFlagEnum, ChessMoveCoordinates } from './entity/chess.interface';
import { ChessBoard } from './entity/chessBoard.entity';

//---- DTO
import { ChessRoomIdDTO, vChessRoomIdDto } from './dto/chessRoomIdDto';
import { ChessAddMoveDto, vChessAddMoveDto } from './dto/chessAddMoveDto';
import { ChessChooseAPieceDTO, vChessChooseAPieceDTO } from './dto/chessChooseAPieceDTO';
import { ChessPromotePawnDto, vChessPromotePawnDto } from './dto/chessPromotePawnDto';
import { DrawDto, vDrawDto } from './dto/drawDto';

//---- Pipe
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';

@Controller('chess')
export class ChessController {
      constructor(
            private readonly chessCommonService: ChessCommonService,
            private readonly chessService: ChessService,
            private readonly chessGateway: ChessGateway,
            private readonly chessBotService: ChessBotService,
      ) {}

      private async isPlaying(board: ChessBoard) {
            if (board.status === ChessStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
      }

      private async isNotPlaying(board: ChessBoard) {
            if (board.status !== ChessStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
      }

      private async getGame(roomId: string) {
            const board = await this.chessCommonService.getBoard(roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');
            return board;
      }

      private async getPlayer(boardId: string, userId: string) {
            const player = await this.chessCommonService.findUser(boardId, userId);
            if (!player) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            return player;
      }

      @Post('/pvp')
      @UseGuards(UserGuard)
      async handleOnCreatePvP(@Req() req: Request) {
            const newGameId = await this.chessCommonService.createNewGame(req.user);

            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Post('/bot')
      @UseGuards(UserGuard)
      async handleOnCreateBot(@Req() req: Request) {
            const newGameId = await this.chessCommonService.createNewGame(req.user, true);
            const playerOne = await this.chessCommonService.findUser(newGameId, req.user.id);
            const bot = await this.chessCommonService.findUser(newGameId, 'BOT');
            await this.chessCommonService.toggleReadyStatePlayer(newGameId, playerOne);
            await this.chessCommonService.toggleReadyStatePlayer(newGameId, bot);

            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Get('/quick-join-room')
      @UseGuards(UserGuard)
      async handleOnQuickJoinRoom(@Req() req: Request) {
            const boardId = await this.chessCommonService.quickJoinRoom();
            if (!boardId) throw apiResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');
            const board = await this.getGame(boardId);
            const isExist = await this.chessCommonService.findUser(board.id, req.user.id);
            if (!isExist) await this.chessCommonService.joinGame(board.id, req.user);

            return apiResponse.send({ data: { roomId: board.id } });
      }

      @Get('/:id')
      @UseGuards(UserGuard)
      async handleOnGameByUserId(@Param('id') id: string) {
            const result = await this.chessCommonService.getAllBoardByUserId(id);

            return apiResponse.send({ data: result });
      }

      @Put('/join-room')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessRoomIdDto))
      async handleOnJoinRoom(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            if (board.status != ChessStatus.NOT_YET)
                  throw apiResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');

            const isExist = await this.chessCommonService.findUser(board.id, req.user.id);
            if (!isExist && board.users.length < 2) await this.chessCommonService.joinGame(board.id, req.user);

            return apiResponse.send({ data: board });
      }

      @Put('/start')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessRoomIdDto))
      async handleOnStartGame(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isPlaying(board);
            await this.getPlayer(board.id, req.user.id);

            const isStart = await this.chessCommonService.startGame(board.id);
            if (!isStart) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.wait-ready-player' } } }, 'BadRequestException');

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/leave')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessRoomIdDto))
      async handleOnLeaveGame(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            const player = await this.getPlayer(board.id, req.user.id);

            await this.chessCommonService.leaveGame(board.id, player);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/ready')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessRoomIdDto))
      async handleOnReadyGame(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isPlaying(board);
            const player = await this.getPlayer(board.id, req.user.id);

            await this.chessCommonService.toggleReadyStatePlayer(board.id, player);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/choose-piece')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessChooseAPieceDTO))
      async handleOnChooseAPiece(@Req() req: Request, @Body() body: ChessChooseAPieceDTO) {
            const board = await this.getGame(body.roomId);
            await this.isNotPlaying(board);
            const player = await this.getPlayer(board.id, req.user.id);

            if (board.board[body.x][body.y].flag !== player.flag)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.is-not-your-piece' } }, data: [] }, 'BadRequestException');

            const legalMoves = await this.chessService.legalMove({ x: body.x, y: body.y }, board.id);

            return apiResponse.send<Array<ChessMoveCoordinates>>({ data: legalMoves });
      }

      @Put('/add-move')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessAddMoveDto))
      async handleOnAddMoveGame(@Req() req: Request, @Body() body: ChessAddMoveDto) {
            const board = await this.getGame(body.roomId);
            await this.isNotPlaying(board);
            const player = await this.getPlayer(board.id, req.user.id);
            const enemyFlag = player.flag === PlayerFlagEnum.WHITE ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;

            if (board.board[body.curPos.x][body.curPos.y].flag !== player.flag)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.is-not-your-piece' } } }, 'BadRequestException');

            const curPos: ChessMoveCoordinates = {
                  x: body.curPos.x,
                  y: body.curPos.y,
            };
            const desPos: ChessMoveCoordinates = {
                  x: body.desPos.x,
                  y: body.desPos.y,
            };

            const legalMoves: ChessMoveCoordinates[] = await this.chessService.legalMove(curPos, board.id);

            const canMove = legalMoves.find(
                  (move) =>
                        move.x === desPos.x &&
                        move.y === desPos.y &&
                        board.board[move.x][move.y].flag === board.board[desPos.x][desPos.y].flag &&
                        board.board[move.x][move.y].chessRole === board.board[desPos.x][desPos.y].chessRole,
            );
            if (!canMove) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.invalid-position' } } }, 'BadRequestException');
            // move chess
            const isMove = await this.chessService.playAMove(player, curPos, desPos, board.id);
            if (!isMove) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.wrong-turn' } } }, 'BadRequestException');

            // check promote pawn
            if (await this.chessService.isPromotePawn(desPos, board.id)) this.chessGateway.promotePawn(board.id, player.id);

            const isWin = await this.chessService.isWin(enemyFlag, board.id);

            if (board.isBotMode && !isWin) await this.chessBotService.botMove(board.id, enemyFlag);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/promote-pawn')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessPromotePawnDto))
      async handleOnPromotePawn(@Req() req: Request, @Body() body: ChessPromotePawnDto) {
            const board = await this.getGame(body.roomId);
            await this.isNotPlaying(board);
            const player = await this.getPlayer(board.id, req.user.id);
            const enemyFlag = player.flag === PlayerFlagEnum.WHITE ? PlayerFlagEnum.BLACK : PlayerFlagEnum.WHITE;

            if (!(await this.chessService.isPromotePawn(body.promotePos, board.id)))
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.invalid-position' } } }, 'BadRequestException');

            if (board.board[body.promotePos.x][body.promotePos.y].flag !== player.flag)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.is-not-your-piece' } } }, 'BadRequestException');

            await this.chessService.promoteMove(body.promotePos, body.promoteRole, board.id);

            await this.chessService.isWin(enemyFlag, board.id);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Post('/restart')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessRoomIdDto))
      async handleOnRestart(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isPlaying(board);
            await this.getPlayer(board.id, req.user.id);

            const newGameId = await this.chessCommonService.restartGame(board.id);

            await this.chessGateway.restartGame(board.id, newGameId);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Post('/draw')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessRoomIdDto))
      async handleOnDrawCreate(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isNotPlaying(board);
            const player = await this.getPlayer(board.id, req.user.id);

            await this.chessCommonService.createDrawRequest(board.id, player);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/draw')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vDrawDto))
      async handleOnDrawChose(@Req() req: Request, @Body() body: DrawDto) {
            const board = await this.getGame(body.roomId);
            const player = await this.getPlayer(board.id, req.user.id);

            if (board.status !== ChessStatus.DRAW)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } }, data: [] }, 'ForbiddenException');

            const remainderUser = board.users.filter((item) => item.id !== player.id);

            if (!remainderUser[0].isDraw)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } }, data: [] }, 'ForbiddenException');

            await this.chessCommonService.draw(board.id, body.isAccept);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/surrender')
      @UseGuards(UserGuard)
      async handleOnSurrender(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            const player = await this.getPlayer(board.id, req.user.id);
            await this.isNotPlaying(board);

            await this.chessCommonService.surrender(board.id, player);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }
}
