import * as React from 'react';
import { User } from '../../common/interface/user.interface';
import { truncateContent } from '../../common/helpers/string.helper';
import { useCountDown } from '../../common/hooks/useCountDown';
import Tooltip from '../tooltip/tooltip-dropbox';
import { TicTacToePlayer } from '../../common/interface/tic-tac-toe.interface';

export interface PlayerInfoProps {
    player: TicTacToePlayer;
    isReverse: boolean;
    time: number;
    isTurn: boolean;
    isStart: boolean;
}

const PlayerInfo: React.FunctionComponent<PlayerInfoProps> = ({ player, isReverse = false, time: remainTime, isTurn, isStart }) => {
    const user = player ? player : { name: 'player', avatarUrl: '/asset/images/default-avatar.png', elo: 0 };
    const [timerFormat, setTimerFormat] = React.useState('00:00');
    const [startTime, setStartTime] = React.useState(new Date());

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTurn && isStart) {
            setStartTime(new Date());
            interval = setInterval(() => calculateTime(), 500);
            if (remainTime <= 0) clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isTurn, isStart, remainTime]);

    const calculateTime = () => {
        const differentTime = new Date().getTime() - startTime.getTime();
        const totalRemain = (remainTime - differentTime) / 1000;
        const minutes = Math.floor(totalRemain / 60);
        const seconds = Math.floor(totalRemain - minutes * 60);
        setTimerFormat(`${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`);
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
                <p>{timerFormat}</p>
            </div>
        </div>
    );
};

export default PlayerInfo;
