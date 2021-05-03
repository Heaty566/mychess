import * as React from 'react';
import { User } from '../../../store/auth/interface';

export interface PlayerInfoProps {
    player: User;
    isReverse: boolean;
}

const PlayerInfo: React.FunctionComponent<PlayerInfoProps> = ({ player, isReverse = false }) => {
    return (
        <div className={`flex flex-1 fade-in ${isReverse && 'flex-row-reverse'}`}>
            <div className="hidden md:block">
                <img
                    src={player ? player.avatarUrl : '/asset/images/default-avatar.png'}
                    alt={player ? player.name : 'player'}
                    className="w-16 h-16"
                />
            </div>
            <div className={`${isReverse ? 'mr-2' : 'ml-2'}`}>
                <h1 className="text-lg font-bold capitalize">{player ? player.name : 'player'}</h1>
                <h4 className="text-sm">Elo: {player ? player.elo : 0}</h4>
            </div>
        </div>
    );
};

export default PlayerInfo;
