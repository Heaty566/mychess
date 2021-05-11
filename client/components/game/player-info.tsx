import * as React from 'react';
import { truncateContent } from '../../common/helpers/string.helper';
import Tooltip from '../tooltip/tooltip-dropbox';
import { TicTacToePlayer } from '../../common/interface/tic-tac-toe.interface';
import { ChessPlayer } from '../../common/interface/chess.interface';

export interface PlayerInfoProps {
    player: TicTacToePlayer | ChessPlayer | undefined;
    isReverse: boolean;
}

const PlayerInfo: React.FunctionComponent<PlayerInfoProps> = ({ player, isReverse = false }) => {
    const user = player ? player : { name: 'player', avatarUrl: '/asset/images/default-avatar.png', elo: 0, time: 0 };

    const calculateTime = (time: number) => {
        const totalRemain = time / 1000;
        const minutes = Math.floor(totalRemain / 60);
        const seconds = Math.floor(totalRemain - minutes * 60);
        if (totalRemain <= 0) return '00:00';
        const formatMinutes = minutes >= 10 ? minutes : `0${minutes}`;
        const formatSeconds = seconds >= 10 ? seconds : `0${seconds}`;
        return `${formatMinutes}:${formatSeconds}`;
    };
    return (
        <div className={`flex flex-1 items-center fade-in ${isReverse && 'flex-row-reverse'}`}>
            <div className="hidden w-16 h-16 md:block">
                <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
            </div>
            <div className={`${isReverse ? 'mr-2' : 'ml-2'}`}>
                <Tooltip content={`${user.name}`} position="top-full" maxLength={15}>
                    <h1 className="text-lg font-bold capitalize">{truncateContent(user.name, 15)}</h1>
                </Tooltip>
                <h4 className="text-sm">Elo: {user.elo}</h4>
                <p>Time: {calculateTime(user.time)}</p>
            </div>
        </div>
    );
};

export default PlayerInfo;
