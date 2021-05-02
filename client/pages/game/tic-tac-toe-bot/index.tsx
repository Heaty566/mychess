import * as React from 'react';
import TTTCell from './ttt-cell';
import { TicTacToeBoard, TicTacToeFlag } from './config';

import { ServerResponse } from '../../../store/api/interface';
import { TTTBotAction, RoomIdDto, TicTacToeStatus } from './config';
import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import { useSocketIo } from '../../../common/hooks/useSocketIo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { AuthState } from '../../../store/auth/interface';

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
    const clientIoTTTBot = useSocketIo({ namespace: 'tic-tac-toe-bot' });

    const [tttBoard, setTTTBoard] = React.useState<TicTacToeBoard>();
    const [roomId, setRoomId] = React.useState<string>();
    const authState = useSelector<RootState, AuthState>((state) => state.auth);

    React.useEffect(() => {
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_GET, (res: ServerResponse<TicTacToeBoard>) => setTTTBoard(res.data));
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_START, () => clientIoTTTBot.emit(TTTBotAction.TTT_BOT_GET, { roomId }));
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_MOVE, () => clientIoTTTBot.emit(TTTBotAction.TTT_BOT_GET, { roomId }));
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_CREATE, (res: ServerResponse<RoomIdDto>) => {
            setRoomId(res.data.roomId);
            clientIoTTTBot.emit(TTTBotAction.TTT_BOT_GET, { roomId: res.data.roomId });
        });

        if (!roomId && authState.isSocketLogin) clientIoTTTBot.emit(TTTBotAction.TTT_BOT_CREATE, {});
    }, [roomId, authState.isSocketLogin]);

    const handleCreateNewGame = () => {
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_LEAVE, { roomId });
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_CREATE, {});
    };

    const handleToStart = () => {
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_START, { roomId });
    };
    const handleToAddMove = (x: number, y: number) => {
        const input = { roomId, x, y };
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_MOVE, input);
    };

    return (
        <div className="m-2 space-y-2">
            <div className="flex justify-between max-w-2xl p-2 mx-auto bg-gray-50">
                <div className="flex flex-1 space-x-2">
                    <div>
                        <img src={tttBoard?.info.users[0].avatarUrl} alt={tttBoard?.info.users[0].name} className="w-16" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">{tttBoard?.info.users[0].name}</h1>
                        <h4 className="text-sm">Elo: {tttBoard?.info.users[0].elo}</h4>
                    </div>
                </div>

                <div className="flex-1">
                    <h1 className="text-lg font-bold text-center">Turn</h1>
                    <div className="w-8 h-8 mx-auto">{tttBoard?.currentTurn ? <XPlayerIcon /> : <OPlayerIcon />}</div>
                </div>
                <div className="flex flex-row-reverse flex-1 ">
                    <div>
                        <img src={tttBoard?.info.users[1].avatarUrl} alt={tttBoard?.info.users[1].name} className="w-16" />
                    </div>
                    <div className="mr-2">
                        <h1 className="text-lg font-bold">{tttBoard?.info.users[1].name}</h1>
                        <h4 className="text-sm">Elo: {tttBoard?.info.users[1].elo}</h4>
                    </div>
                </div>
            </div>
            <div className="relative m-auto ttt-board">
                {tttBoard?.info.status !== TicTacToeStatus['PLAYING'] && (
                    <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-90">
                        <div className="p-5 rounded-sm bg-warmGray-50">
                            {tttBoard?.info.status === TicTacToeStatus['NOT-YET'] && (
                                <button className="px-4 py-2 font-semibold bg-blue-500 rounded-sm text-mercury " onClick={() => handleToStart()}>
                                    Start
                                </button>
                            )}
                            {tttBoard?.info.status === TicTacToeStatus['END'] && (
                                <>
                                    <h1 className="text-xl font-bold text-center">{tttBoard.info.winner ? 'Player win' : 'Bot win'}</h1>
                                    <button
                                        className="px-4 py-2 font-bold bg-blue-500 rounded-sm text-mercury "
                                        onClick={() => handleCreateNewGame()}
                                    >
                                        Restart
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className="grid bg-warmGray-900 grid-cols-14 ">
                    {tttBoard?.board.map((item, index) => {
                        return item.map((item2, index2) => {
                            return <TTTCell key={`${index}${index2}`} cellFlag={item2} handleOnClick={() => handleToAddMove(index, index2)} />;
                        });
                    })}
                </div>
            </div>
        </div>
    );
};

export default TicTacToeBot;
