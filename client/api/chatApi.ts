import http from './axiosCommon';
import { RoomIdChatDto, SendMessageDTO } from '../common/interface/dto/chat.dto';
import { ServerResponse } from '../common/interface/api.interface';

export const chatApi = {
    joinChat: async (input: RoomIdChatDto) => {
        const url = `/chat/join`;
        const res = await http.put<ServerResponse<RoomIdChatDto>>(url, input);
        return res;
    },

    sendMessageChat: async (input: SendMessageDTO) => {
        const url = `/chat/send-message`;
        const res = await http.put<ServerResponse<RoomIdChatDto>>(url, input);
        return res;
    },

    leaveChat: async (input: RoomIdChatDto) => {
        const url = `/chat/leave`;
        const res = await http.put<ServerResponse<RoomIdChatDto>>(url, input);
        return res;
    },
};
