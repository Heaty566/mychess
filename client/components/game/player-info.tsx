import * as React from 'react';
import { truncateContent } from '../../common/helpers/string.helper';
import { convertTimeToNumber } from '../../common/helpers/timer.helper';
import { GamePlayer } from '../../common/interface/game.interface';
import TooltipDropBox from '../tooltip/tooltip-dropbox';

export interface PlayerInfoProps {
    player: GamePlayer;
    isReverse: boolean;
}

const PlayerInfo: React.FunctionComponent<PlayerInfoProps> = ({ player, isReverse = false }) => {
    const user = player ? player : { name: 'player', avatarUrl: '/asset/images/default-avatar.png', elo: 0, time: 0 };

    return (
        <div className={`flex flex-1 items-center fade-in ${isReverse && 'flex-row-reverse'}`}>
            <div className="hidden w-16 h-16 md:block">
                <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
            </div>
            <div className={`${isReverse ? 'mr-2' : 'ml-2'}`}>
                <TooltipDropBox content={`${user.name}`} position="top-full" maxLength={15}>
                    <h1 className="text-lg font-bold capitalize">{truncateContent(user.name, 15)}</h1>
                </TooltipDropBox>
                <h4 className="text-sm">Elo: {user.elo}</h4>
                <p>Time: {convertTimeToNumber(user.time)}</p>
            </div>
        </div>
    );
};

export default PlayerInfo;
