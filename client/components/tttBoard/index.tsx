import * as React from 'react';
import TTTCell from './ttt-cell';
import { TicTacToeFlag } from './config';

import * as io from 'socket.io-client';
import AutoSocketUser from '../../common/HOC/autoSocketUser';

const defaultCell: Array<Array<TicTacToeFlag>> = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

export interface TicTacToeBotProps {}

const TicTacToeBot: React.FunctionComponent<TicTacToeBotProps> = () => {
    const [cells, setCells] = React.useState<Array<Array<TicTacToeFlag>>>(defaultCell);
    const [roomId, setRoomId] = React.useState<string>();
    const clientTTTBot = io.connect('http://localhost:4000/api/tic-tac-toe-bot');

    React.useEffect(() => {
        clientTTTBot.on('ttt-bot-get', (res: any) => {
            console.log(res.data);
            setCells(res.data.board);
        });

        clientTTTBot.on('ttt-bot-start', (data: any) => {
            console.log('hello');
            console.log(data);
        });
        clientTTTBot.on('ttt-bot-move', (data: any) => {
            clientTTTBot.emit('ttt-bot-get', { roomId });
        });
        clientTTTBot.on('ttt-bot-create', (res: any) => {
            setRoomId(res.data.roomId);
        });
        if (!roomId) clientTTTBot.emit('ttt-bot-create', {});
    }, [clientTTTBot, roomId]);

    const handleToStart = () => {
        clientTTTBot.emit('ttt-bot-start', { roomId });
    };
    const handleToAddMove = (x: number, y: number) => {
        console.log('hello');
        clientTTTBot.emit('ttt-bot-move', { roomId, x, y });
    };

    return (
        <AutoSocketUser ioConnect={clientTTTBot}>
            <div className="">
                <div className="">
                    <div>
                        <h1></h1>
                    </div>
                    <div>
                        <h1></h1>
                    </div>
                </div>
                <div>
                    <div className="grid m-auto bg-warmGray-900 ttt-cells-14">
                        {cells.map((item, index) => {
                            return item.map((item2, index2) => {
                                return <TTTCell key={`${index}${index2}`} cellFlag={item2} handleOnClick={() => handleToAddMove(index, index2)} />;
                            });
                        })}
                    </div>
                </div>
            </div>
        </AutoSocketUser>
    );
};

export default TicTacToeBot;
