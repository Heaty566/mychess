import * as React from 'react';
import { User } from '../../../common/interface/user.interface';
import { truncateContent } from '../../../common/helpers/string.helper';
import { useCountDown } from '../../../common/hooks/useCountDown';
import Tooltip from '../../tooltip';
import { TicTacToePlayer } from '../../../common/interface/tic-tac-toe.interface';

export interface PlayerInfoProps {
    player: TicTacToePlayer;
    isReverse: boolean;
    time: number;
}

const PlayerInfo: React.FunctionComponent<PlayerInfoProps> = ({ player, isReverse = false, time }) => {
    const user = player ? player : { name: 'player', avatarUrl: '/asset/images/default-avatar.png', elo: 0 };

    return (
        <div className={`flex flex-1 items-center fade-in ${isReverse && 'flex-row-reverse'}`}>
            <div className="hidden w-16 h-16 md:block">
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full" />
            </div>
            <div className={`${isReverse ? 'mr-2' : 'ml-2'}`}>
                <Tooltip content={`${user.name}`} position="top-full" maxLength={15}>
                    <h1 className="text-lg font-bold capitalize">{truncateContent(user.name, 15)}</h1>
                </Tooltip>
                <h4 className="text-sm">Elo: {user.elo}</h4>
                <p>{time}</p>
            </div>
        </div>
    );
};

export default PlayerInfo;
