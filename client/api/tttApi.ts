import { AddMoveDto, RoomIdDto } from '../common/interface/dto/ttt.dto';
import { DrawDTO } from '../common/interface/dto/chess.dto';
import { ServerResponse } from '../common/interface/api.interface';
import { TicTacToeBoard } from '../common/interface/tic-tac-toe.interface';
import http from './axiosCommon';

export const ticTacToeApi = {
    createNewPvPRoom: async () => {
        const url = `/ttt/pvp`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url);
        return res;
    },
    getAllGameByUserId: async (userId: string) => {
        const url = `/ttt/${userId}`;
        const res = await http.get<ServerResponse<{ boards: TicTacToeBoard[]; count: number; totalWin: number }>>(url);
        return res;
    },
    createNewBotRoom: async () => {
        const url = `/ttt/bot`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url);
        return res;
    },
    addMovePvP: async (input: AddMoveDto) => {
        const url = `/ttt/add-move`;
        const res = await http.put<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },
    readyGame: async (input: RoomIdDto) => {
        const url = `/ttt/ready`;
        const res = await http.put<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },
    leaveGame: async (input: RoomIdDto) => {
        const url = `/ttt/leave`;
        const res = await http.put<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },

    startGame: async (input: RoomIdDto) => {
        const url = `/ttt/start`;
        const res = await http.put<ServerResponse<null>>(url, input);
        return res;
    },

    quickJoin: async () => {
        const url = `/ttt/quick-join-room`;
        const res = await http.get<ServerResponse<RoomIdDto>>(url);
        return res;
    },
    restartGame: async (input: RoomIdDto) => {
        const url = `/ttt/restart`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },

    joinRoom: async (input: RoomIdDto) => {
        const url = `/ttt/join-room`;
        const res = await http.put<ServerResponse<TicTacToeBoard>>(url, input);
        return res;
    },

    drawGameCreate: async (input: RoomIdDto) => {
        const url = `/ttt/draw`;
        const res = await http.post<ServerResponse<RoomIdDto>>(url, input);
        return res;
    },

    drawGameAccept: async (input: DrawDTO) => {
        const url = `/ttt/draw`;
        const res = await http.put<ServerResponse<DrawDTO>>(url, input);
        return res;
    },

    surrender: async (input: RoomIdDto) => {
        const url = `/ttt/surrender`;
        const res = await http.put<ServerResponse<void>>(url, input);
        return res;
    },
};
