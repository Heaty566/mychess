import * as React from 'react';

import { UseFormRegister } from 'react-hook-form';
import { Chat } from '../../common/interface/chat.interface';
import { GamePlayer, GamePlayerFlag } from '../../common/interface/game.interface';

import ChatMessage from './chat-message';

export interface ChatProps {
    chat: Chat;
    handleOnSendMessage: () => void;
    users: GamePlayer[];
    register: UseFormRegister<any>;
    wrapperRef: React.MutableRefObject<any>;
}

const ChatBox: React.FunctionComponent<ChatProps> = ({ chat: chatInfo, handleOnSendMessage, users, register, wrapperRef }) => {
    return (
        <div className="box-border flex flex-col p-2 m-2 space-y-2 overflow-hidden rounded-sm md:m-0 h-72 md:max-w-xs bg-woodsmoke fade-in ">
            <div className="flex-1 space-y-1 overflow-auto" ref={wrapperRef}>
                {chatInfo.messages.map((item) => {
                    const player = users.find((user) => user.id === item.userId);
                    const isReverse = player?.flag === GamePlayerFlag.USER2;
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
