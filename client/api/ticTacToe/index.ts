import http from '../axiosCommon';
import { AxiosInstance } from 'axios';
import { RoomIdDto } from './dto';
import { ServerResponse } from '../../store/api/interface';

export class TicTacToeAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {}

    async checkExistRoom(input: RoomIdDto) {
        const url = `${this.prefix + '/check-room'}`;
        const res = await this.apiCall.post<ServerResponse<null>>(url, input);
        return res;
    }
    async createNewRoom() {
        const url = `${this.prefix + '/'}`;
        const res = await this.apiCall.post<ServerResponse<RoomIdDto>>(url);
        return res;
    }
}
export const ticTacToeApi = new TicTacToeAPI(http, '/tic-tac-toe');
export default ticTacToeApi;
