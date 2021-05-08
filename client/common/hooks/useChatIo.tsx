import * as React from 'react';
import chatApi from '../../api/chatApi';
import { ServerResponse } from '../interface/api.interface';
import { Chat, ChatGatewayAction } from '../interface/chat.interface';
import useSocketIo from './useSocketIo';
import { useForm, UseFormRegister } from 'react-hook-form';
import { MessageDTO } from '../interface/dto/chat.dto';

const defaultValues: MessageDTO = {
    content: '',
};

export function useChatIo(chatId: string | undefined): [Chat | undefined, UseFormRegister<MessageDTO>, () => Promise<void>] {
    const clientChatIo = useSocketIo({ namespace: 'chat' });
    const { register, handleSubmit, reset } = useForm<MessageDTO>({ defaultValues });
    const [chat, setChat] = React.useState<Chat>();

    const handleOnSendMessage = (data: MessageDTO) => {
        if (chatId && data.content)
            chatApi.sendMessageChat({ chatId, content: data.content }).then(() => {
                reset(defaultValues);
            });
    };

    const onChatGet = (res: ServerResponse<Chat>) => setChat(res.data);
    const emitChatGet = () => clientChatIo.emit(ChatGatewayAction.CHAT_GET, { chatId });

    React.useEffect(() => {
        if (chatId) chatApi.joinChat({ chatId }).then(() => clientChatIo.emit(ChatGatewayAction.CHAT_JOIN, { chatId }));
    }, [chatId]);

    React.useEffect(() => {
        clientChatIo.on(ChatGatewayAction.CHAT_JOIN, emitChatGet);
        clientChatIo.on(ChatGatewayAction.CHAT_GET, onChatGet);

        return () => {
            clientChatIo.off(ChatGatewayAction.CHAT_JOIN, emitChatGet);
            clientChatIo.off(ChatGatewayAction.CHAT_GET, onChatGet);
        };
    }, [chatId]);

    return [chat, register, handleSubmit(handleOnSendMessage)];
}

export default useChatIo;
