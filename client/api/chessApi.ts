import { RoomIdDto } from '../common/interface/dto/ttt.dto';
import { ChessChooseAPieceDTO, DrawDTO, PromoteChessDto } from '../common/interface/dto/chess.dto';
import { ChessMoveRedis } from '../common/interface/chess.interface';
import { ServerResponse } from '../common/interface/api.interface';
import { TicTacToeBoard } from '../common/interface/tic-tac-toe.interface';
import http from './axiosCommon';

export const chessApi = {
    createNewPvPRoom: async () => {
        const url = `/chess/pvp`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url);
        return res;
    },
    getAllGameByUserId: async (userId: string) => {
        const url = `/chess/${userId}`;
        const res = await http.get<ServerResponse<{ boards: TicTacToeBoard[]; count: number; totalWin: number }>>(url);
        return res;
    },

    quickJoin: async () => {
        const url = `/chess/quick-join-room`;
        const res = await http.get<ServerResponse<RoomIdDto>>(url);
        return res;
    },

    createNewBotRoom: async () => {
        const url = `/chess/bot`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url);
        return res;
    },
    addMovePvP: async (input: { roomId: string; curPos: { x: number; y: number }; desPos: { x: number; y: number } }) => {
        const url = `/chess/add-move`;
        const res = await http.put<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },
    readyGame: async (input: RoomIdDto) => {
        const url = `/chess/ready`;
        const res = await http.put<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },
    promoteChess: async (input: PromoteChessDto) => {
        const url = `/chess/promote-pawn`;
        const res = await http.put<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },

    drawGameCreate: async (input: RoomIdDto) => {
        const url = `/chess/draw`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },

    drawGameAccept: async (input: DrawDTO) => {
        const url = `/chess/draw`;
        const res = await http.put<ServerResponse<DrawDTO>>(url, input);
        return res;
    },

    leaveGame: async (input: RoomIdDto) => {
        const url = `/chess/leave`;
        const res = await http.put<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },

    startGame: async (input: RoomIdDto) => {
        const url = `/chess/start`;
        const res = await http.put<ServerResponse<null>>(url, input);
        return res;
    },

    restartGame: async (input: RoomIdDto) => {
        const url = `/chess/restart`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },

    joinRoom: async (input: RoomIdDto) => {
        const url = `/chess/join-room`;
        const res = await http.put<ServerResponse<null>>(url, input);
        return res;
    },
    getSuggestion: async (input: ChessChooseAPieceDTO) => {
        const url = `/chess/choose-piece`;
        const res = await http.post<ServerResponse<ChessMoveRedis[]>>(url, input);
        return res;
    },

    surrender: async (input: RoomIdDto) => {
        const url = `/chess/surrender`;
        const res = await http.put<ServerResponse<void>>(url, input);
        return res;
    },
};
