import http from '../axiosCommon';
import { AxiosInstance } from 'axios';
import { RoomIdDto } from './dto';
import { ServerResponse } from '../../store/api/interface';

export class TicTacToeAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {}

    async createNewRoom() {
        const url = `${this.prefix + '/'}`;
        const res = await this.apiCall.post<ServerResponse<RoomIdDto>>(url);
        return res;
    }
    async createBot() {
        const url = `${this.prefix + '/create-bot'}`;
        const res = await this.apiCall.post<ServerResponse<RoomIdDto>>(url);
        return res;
    }
    async joinRoom(input: RoomIdDto) {
        const url = `${this.prefix + '/join-room'}`;
        const res = await this.apiCall.post<ServerResponse<null>>(url, input);
        return res;
    }
}
export const ticTacToeApi = new TicTacToeAPI(http, '/tic-tac-toe');
export default ticTacToeApi;
