import * as React from 'react';

export interface ChatMessageProps {
    content: string;
    avatarUrl: string;
    isReverse: boolean;
}

const ChatMessage: React.FunctionComponent<ChatMessageProps> = ({ content, avatarUrl, isReverse }) => {
    return (
        <div className={`p-1 text-white fade-in  ${isReverse ? 'text-blue-600' : 'text-rose-500'} max-w-xs`}>
            <div className={`flex space-x-1 ${isReverse ? 'flex-row-reverse' : 'flex-row'}`}>
                <img src={avatarUrl} className="object-cover w-8 h-8 rounded-full" />
                <div>
                    <p className="flex-1 break-all">{content}</p>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
