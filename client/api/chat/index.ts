import http from '../axiosCommon';
import { AxiosInstance } from 'axios';
import { RoomIdChatDto, SendMessageDTO } from './dto';
import { ServerResponse } from '../../store/api/interface';

export class ChatAPI {
    constructor(private readonly apiCall: AxiosInstance, readonly prefix: string) {}

    async joinChat(input: RoomIdChatDto) {
        const url = `${this.prefix + '/join'}`;
        const res = await this.apiCall.post<ServerResponse<RoomIdChatDto>>(url, input);
        return res;
    }
    async sendMessageChat(input: SendMessageDTO) {
        const url = `${this.prefix + '/send-message'}`;
        const res = await this.apiCall.post<ServerResponse<RoomIdChatDto>>(url, input);
        return res;
    }
    async leaveChat(input: RoomIdChatDto) {
        const url = `${this.prefix + '/leave'}`;
        const res = await this.apiCall.post<ServerResponse<RoomIdChatDto>>(url, input);
        return res;
    }
}
export const chatApi = new ChatAPI(http, '/chats');
export default chatApi;
