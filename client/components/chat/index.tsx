import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Chat } from '../../common/interface/chat.interface';
import { TicTacToeFlag, TicTacToePlayer } from '../../common/interface/tic-tac-toe.interface';
import ChatMessage from './chat-message';

export interface ChatProps {
    chat: Chat;
    handleOnSendMessage: () => void;
    users: TicTacToePlayer[];
    register: UseFormRegister<any>;
    wrapperRef: React.MutableRefObject<any>;
}

const ChatBox: React.FunctionComponent<ChatProps> = ({ chat: chatInfo, handleOnSendMessage, users, register, wrapperRef }) => {
    return (
        <div className="box-border flex flex-col flex-1 p-2 m-2 space-y-2 overflow-hidden rounded-sm md:m-0 h-96 md:max-w-xs bg-woodsmoke ">
            <div className="flex-1 space-y-1 overflow-auto" ref={wrapperRef}>
                {chatInfo.messages.map((item) => {
                    const player = users.find((user) => user.id === item.userId);
                    const isReverse = player?.flag === TicTacToeFlag.RED;
                    return (
                        <ChatMessage
                            avatarUrl={player ? player.avatarUrl : '/asset/images/default-avatar.png'}
                            content={item.content}
                            isReverse={isReverse}
                            key={item.createDate.toString()}
                        />
                    );
                })}
            </div>
            <form className="flex" onSubmit={handleOnSendMessage}>
                <input autoComplete="off" className="flex-1 px-2 py-1 resize-none focus:outline-none" {...register('content')} placeholder="GG..." />
            </form>
        </div>
    );
};

export default ChatBox;
