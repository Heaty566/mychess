import * as React from 'react';
import chatApi from '../../api/chatApi';
import { ServerResponse } from '../interface/api.interface';
import { Chat, ChatGatewayAction } from '../interface/chat.interface';
import useSocketIo from './useSocketIo';
import { useForm, UseFormRegister } from 'react-hook-form';
import { MessageDTO } from '../interface/dto/chat.dto';

const chatDefault: Chat = {
    createDate: new Date(),
    id: '',
    messages: [],
    users: [],
};

const defaultValues: MessageDTO = {
    content: '',
};

export function useChatIo(chatId: string | undefined) {
    const clientChatIo = useSocketIo({ namespace: 'chat' });
    const { register, handleSubmit, reset } = useForm<MessageDTO>({ defaultValues });
    const wrapperRef = React.useRef<HTMLElement>();
    const [chat, setChat] = React.useState<Chat>(chatDefault);

    const handleOnSendMessage = (data: MessageDTO) => {
        if (chatId && data.content) {
            chatApi
                .sendMessageChat({ chatId, content: data.content })
                .then(() => reset(defaultValues))
                .catch((error) => console.log(error));
        }
    };

    const onChatGet = (res: ServerResponse<Chat>) => {
        setChat(res.data);
        if (wrapperRef.current) {
            wrapperRef.current.scrollTop = 999999;
        }
    };
    const emitChatGet = () => clientChatIo.emit(ChatGatewayAction.CHAT_GET, { chatId });

    React.useEffect(() => {
        if (chat?.messages.length) {
            const sound = new Audio('/asset/sounds/message-alert.mp3');
            sound.volume = 0.2;
            sound.play();
        }
    }, [chat?.messages.length]);

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

    return { chat, chatRegister: register, chatWrapperRef: wrapperRef, handleOnSendChatMessage: handleSubmit(handleOnSendMessage) };
}

export default useChatIo;
