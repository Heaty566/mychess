import { Body, Controller, Post, Put, Req, UseGuards, UsePipes, Get, Param } from '@nestjs/common';
import { Request } from 'express';

//---- Service
import { ChessService } from './chess.service';
import { RedisService } from '../utils/redis/redis.service';
import { ChessCommonService } from './chessCommon.service';
import { UserGuard } from '../auth/auth.guard';

//---- Gateway
import { ChessGateway } from './chess.gateway';

//---- Entity
import { ChessMoveRedis, ChessStatus, PlayerFlagEnum, ChessMoveCoordinates } from './entity/chess.interface';
import { ChessBoard } from './entity/chessBoard.entity';

//---- DTO
import { ChessRoomIdDTO, vChessRoomIdDto } from './dto/chessRoomIdDto';
import { ChessAddMoveDto, vChessAddMoveDto } from './dto/chessAddMoveDto';
import { ChessChooseAPieceDTO, vChessChooseAPieceDTO } from './dto/chessChooseAPieceDTO';
import { ChessPromotePawnDto, vChessPromotePawnDto } from './dto/chessPromotePawnDto';
import { ChessEnPassantDto, vChessEnPassantDto } from './dto/chessEnPassantDto';

//---- Pipe
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';
import { RecordingRulesInstance } from 'twilio/lib/rest/video/v1/room/roomRecordingRule';

@Controller('chess')
export class ChessController {
      constructor(
            private readonly redisService: RedisService,
            private readonly chessCommonService: ChessCommonService,
            private readonly chessService: ChessService,
            private readonly chessGateway: ChessGateway,
      ) {}

      private async isPlaying(board: ChessBoard) {
            if (board.status === ChessStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
      }

      private async getGame(roomId: string) {
            const board = await this.chessCommonService.getBoard(roomId);
            if (!board) throw apiResponse.sendError({ details: { roomId: { type: 'field.not-found' } } }, 'NotFoundException');
            return board;
      }

      private async getPlayer(boardId: string, userId: string) {
            const player = await this.chessCommonService.isExistUser(boardId, userId);
            if (!player) throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');
            return player;
      }

      @Post('/pvp')
      @UseGuards(UserGuard)
      async handleOnCreatePvP(@Req() req: Request) {
            const newGameId = await this.chessCommonService.createNewGame(req.user);

            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: newGameId } });
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
            const isExist = await this.chessCommonService.isExistUser(board.id, req.user.id);
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
            //
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

            if (board.status !== ChessStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } }, data: [] }, 'ForbiddenException');
            const player = await this.getPlayer(board.id, req.user.id);

            // pick empty square
            if (board.board[body.x][body.y].flag === PlayerFlagEnum.EMPTY)
                  throw apiResponse.sendError({ details: {}, data: [] }, 'BadRequestException');
            // pick enemy piece
            if (board.board[body.x][body.y].flag !== player.flag) throw apiResponse.sendError({ details: {}, data: [] }, 'BadRequestException');
            // not player turn
            if ((board.turn === false && player.flag === PlayerFlagEnum.BLACK) || (board.turn === true && player.flag === PlayerFlagEnum.WHITE))
                  throw apiResponse.sendError({ details: {}, data: [] }, 'BadRequestException');

            const currentPosition: ChessMoveCoordinates = {
                  x: body.x,
                  y: body.y,
            };

            const legalMoves = this.chessService.legalMove(currentPosition, board);
            return apiResponse.send<Array<ChessMoveCoordinates>>({ data: legalMoves });
      }

      @Put('/add-move')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessAddMoveDto))
      async handleOnAddMoveGame(@Req() req: Request, @Body() body: ChessAddMoveDto) {
            const board = await this.getGame(body.roomId);
            if (board.status !== ChessStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            const player = await this.getPlayer(board.id, req.user.id);

            if (board.board[body.curPos.x][body.curPos.y].flag === PlayerFlagEnum.EMPTY)
                  throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            if (board.board[body.curPos.x][body.curPos.y].flag !== player.flag) throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            const curPos: ChessMoveCoordinates = {
                  x: body.curPos.x,
                  y: body.curPos.y,
            };
            const desPos: ChessMoveCoordinates = {
                  x: body.desPos.x,
                  y: body.desPos.y,
            };

            const legalMoves: ChessMoveCoordinates[] = await this.chessService.legalMove(curPos, board);

            // add en passant to available move
            const enPassantPosRedis: ChessMoveCoordinates = await this.redisService.getObjectByKey('chess-en-passant' + board.id);
            if (enPassantPosRedis) legalMoves.push(enPassantPosRedis);

            const canMove = legalMoves.find(
                  (move) =>
                        move.x === desPos.x &&
                        move.y === desPos.y &&
                        board.board[move.x][move.y].flag === board.board[desPos.x][desPos.y].flag &&
                        board.board[move.x][move.y].chessRole === board.board[desPos.x][desPos.y].chessRole,
            );

            if (!canMove) throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            // move chess
            await this.chessService.playAMove(curPos, desPos, board);

            // check en passant move
            if (enPassantPosRedis && this.chessService.isEnPassantMove(desPos, enPassantPosRedis, board)) {
                  this.chessGateway.enPassantMove(board.id, enPassantPosRedis);
                  await this.redisService.deleteByKey('chess-en-passant' + board.id);
            }

            // check en passant conditions
            const enPassantPos = this.chessService.enPassantPos(curPos, desPos, board);
            if (enPassantPos) this.redisService.setObjectByKey('chess-en-passant' + board.id, enPassantPos);

            // check promote pawn
            if (this.chessService.isPromotePawn(desPos, board)) this.chessGateway.promotePawn(board.id, desPos);

            await this.chessService.checkmate(player.flag, board);
            await this.chessService.stalemate(player.flag, board);

            await this.chessGateway.sendToRoom(board.id);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: board.id } });
      }

      @Put('/promote-pawn')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessPromotePawnDto))
      async handleOnPromotePawn(@Req() req: Request, @Body() body: ChessPromotePawnDto) {
            let board = await this.getGame(body.roomId);
            if (board.status !== ChessStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            if (!this.chessService.isPromotePawn(body.promotePos, board)) throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            const player = await this.getPlayer(board.id, req.user.id);
            if (board.board[body.promotePos.x][body.promotePos.y].flag === PlayerFlagEnum.EMPTY)
                  throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            if (board.board[body.promotePos.x][body.promotePos.y].flag !== player.flag)
                  throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            board.board[body.promotePos.x][body.promotePos.y].chessRole = body.promoteRole;
            await this.chessCommonService.setBoard(board);

            await this.chessGateway.sendToRoom(board.id);
            board = await this.chessCommonService.getBoard(body.roomId);
            return apiResponse.send({ data: board });
      }


      @Put('/en-passant')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessEnPassantDto))
      async handleOnEnPassantMove(@Req() req: Request, @Body() body: ChessEnPassantDto) {
            let board = await this.getGame(body.roomId);
            if (board.status !== ChessStatus.PLAYING)
                  throw apiResponse.sendError({ details: { errorMessage: { type: 'error.not-allow-action' } } }, 'ForbiddenException');

            const player = await this.getPlayer(board.id, req.user.id);
            if (board.board[body.enPassantPos.x][body.enPassantPos.y].flag === PlayerFlagEnum.EMPTY)
                  throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            if (board.board[body.enPassantPos.x][body.enPassantPos.y].flag !== player.flag)
                  throw apiResponse.sendError({ details: {} }, 'BadRequestException');

            await this.chessService.enPassantMove(body.enPassantPos, board);

            await this.chessGateway.sendToRoom(board.id);
            board = await this.chessCommonService.getBoard(body.roomId);
            return apiResponse.send({ data: board });
      }

      @Post('/restart')
      @UseGuards(UserGuard)
      @UsePipes(new JoiValidatorPipe(vChessRoomIdDto))
      async handleOnRestart(@Req() req: Request, @Body() body: ChessRoomIdDTO) {
            const board = await this.getGame(body.roomId);
            await this.isPlaying(board);
            await this.getPlayer(board.id, req.user.id);

            const newGameId = await this.chessCommonService.createNewGame(req.user, false);

            await this.chessGateway.restartGame(board.id, newGameId);
            return apiResponse.send<ChessRoomIdDTO>({ data: { roomId: newGameId } });
      }

      @Put('/draw')
      @UseGuards(UserGuard)
      async handleOnDraw() {
            //
      }
}
