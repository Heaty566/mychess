import * as React from 'react';
import TTTCell from './ttt-cell';
import { TicTacToeFlag } from './config';
import { authApi } from '../../../api/auth';
import * as io from 'socket.io-client';
import { TTTBotAction } from '../../../common/constants/socketAction';
import axios from 'axios';
import AutoSocketUser from '../../../common/HOC/autoSocketUser';

const defaultCell: Array<Array<TicTacToeFlag>> = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

const clientTTTBot = io.connect('http://localhost:4000/tic-tac-toe-bot');

export interface TicTacToeBotProps {}

const TicTacToeBot: React.FunctionComponent<TicTacToeBotProps> = () => {
    const [cells, setCells] = React.useState<Array<Array<TicTacToeFlag>>>(defaultCell);
    React.useEffect(() => {
        clientTTTBot.on(TTTBotAction.TTT_BOT_GET, (data: any) => {
            console.log(data);
        });
    }, [clientTTTBot]);

    const handleoo = () => {
        console.log('hello');
        clientTTTBot.emit('ttt-bot-get', { roomId: '21321' });
    };

    return (
        <AutoSocketUser namespace="tic-tac-toe-bot">
            <div>
                <button onClick={() => handleoo()}>hello</button>
                <div className="grid ttt-cells-14">
                    {cells.map((item, index) => {
                        return item.map((item2, index2) => {
                            return <TTTCell key={`${index}${index2}`} cellFlag={item2} />;
                        });
                    })}
                </div>
            </div>
        </AutoSocketUser>
    );
};

export default TicTacToeBot;
