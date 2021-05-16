import { PublicUser } from './user.interface';

export enum ChatGatewayAction {
    CHAT_GET = 'chat-get',
    CHAT_JOIN = 'chat-join',
}

export interface Chat {
    id: string;
    createDate: Date;
    messages: Message[];
    users: PublicUser[];
}

export interface Message {
    id: string;
    content: string;
    createDate: Date;
    chat: Chat;
    userId: string;
}
