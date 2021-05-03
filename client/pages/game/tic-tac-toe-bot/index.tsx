import * as React from 'react';
import { useSelector } from 'react-redux';

import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import { TTTBotAction, TicTacToeStatus, TicTacToeBoard } from '../../../components/game/tttBoard/config';
import { RoomIdDto } from '../../../common/interface/dto/roomIdDto';
import { useSocketIo } from '../../../common/hooks/useSocketIo';
import { AuthState } from '../../../store/auth/interface';
import { ServerResponse } from '../../../store/api/interface';
import routers from '../../../common/constants/router';
import { RootState } from '../../../store';

import TTTBoard from '../../../components/game/tttBoard';
import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';
import PlayerInfo from '../../../components/game/playerInfo';
import GameTurn from '../../../components/game/gameTurn';
import GamePanel from '../../../components/game/panel';
import WaveLoading from '../../../components/loading/waveLoading';
import PanelRestart from '../../../components/game/panel/panelRestart';
import PanelStart from '../../../components/game/panel/panelStart';
import SeoHead from '../../../components/common/seoHead';
import { GetServerSidePropsContext } from 'next';

export interface TicTacToeBotProps {}

const TicTacToeBot: React.FunctionComponent<TicTacToeBotProps> = () => {
    const clientIoTTTBot = useSocketIo({ namespace: 'tic-tac-toe-bot' });
    const chessBoardRef = React.useRef<HTMLDivElement>(null);
    const [tttBoard, setTTTBoard] = React.useState<TicTacToeBoard>();
    const [roomId, setRoomId] = React.useState<string>();
    const authState = useSelector<RootState, AuthState>((state) => state.auth);

    const onTTTBotGet = (res: ServerResponse<TicTacToeBoard>) => setTTTBoard(res.data);
    const onTTTBotMove = () => clientIoTTTBot.emit(TTTBotAction.TTT_BOT_GET, { roomId });
    const onTTTBotCreate = (res: ServerResponse<RoomIdDto>) => {
        setRoomId(res.data.roomId);
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_GET, { roomId: res.data.roomId });
    };
    const onTTTBotStart = () => {
        if (chessBoardRef.current) {
            const clientWidth = chessBoardRef.current.clientWidth / 2;
            const scrollCenter = chessBoardRef.current.scrollWidth / 2 - clientWidth;
            chessBoardRef.current.scrollLeft = scrollCenter;
        }

        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_GET, { roomId });
    };
    const onTTTBotWin = () => {
        const sound = new Audio('/asset/sounds/end-game.mp3');
        sound.volume = 0.5;
        sound.play();
    };

    const handleEmitCreateNewGame = () => {
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_LEAVE, { roomId });
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_CREATE, {});
    };

    const handleEmitStart = () => clientIoTTTBot.emit(TTTBotAction.TTT_BOT_START, { roomId });

    const handleEmitAddMove = (x: number, y: number) => {
        const input = { roomId, x, y };
        const sound = new Audio('/asset/sounds/ttt_click.mp3');
        sound.volume = 0.3;
        sound.play();
        clientIoTTTBot.emit(TTTBotAction.TTT_BOT_MOVE, input);
    };

    React.useEffect(() => {
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_GET, onTTTBotGet);
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_START, onTTTBotStart);
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_MOVE, onTTTBotMove);
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_CREATE, onTTTBotCreate);
        clientIoTTTBot.on(TTTBotAction.TTT_BOT_WIN, onTTTBotWin);
        if (!roomId && authState.isSocketLogin) clientIoTTTBot.emit(TTTBotAction.TTT_BOT_CREATE, {});
        return () => {
            clientIoTTTBot.off(TTTBotAction.TTT_BOT_WIN, onTTTBotWin);
            clientIoTTTBot.off(TTTBotAction.TTT_BOT_GET, onTTTBotGet);
            clientIoTTTBot.off(TTTBotAction.TTT_BOT_START, onTTTBotStart);
            clientIoTTTBot.off(TTTBotAction.TTT_BOT_MOVE, onTTTBotMove);
            clientIoTTTBot.off(TTTBotAction.TTT_BOT_CREATE, onTTTBotCreate);
        };
    }, [roomId, authState.isSocketLogin]);

    return (
        <>
            <SeoHead {...routers.ticTacToeBot.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {tttBoard ? (
                        <>
                            <div className="flex justify-between max-w-2xl p-2 mx-auto bg-gray-50">
                                <PlayerInfo player={tttBoard.info.users[0]} isReverse={false} />
                                <GameTurn currentTurn={tttBoard.currentTurn} SymbolOne={OPlayerIcon} SymbolTwo={XPlayerIcon} />
                                <PlayerInfo player={tttBoard.info.users[1]} isReverse={true} />
                            </div>
                            <div className="relative m-auto ttt-board">
                                <GamePanel isAppear={tttBoard.info.status !== TicTacToeStatus['PLAYING']}>
                                    <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-20">
                                        <div className="p-5 m-2 space-y-2 text-center rounded-sm bg-warmGray-50">
                                            {tttBoard.info.status === TicTacToeStatus['NOT-YET'] && <PanelStart handleOnClick={handleEmitStart} />}
                                            {tttBoard.info.status === TicTacToeStatus['END'] && (
                                                <PanelRestart
                                                    handleOnClick={handleEmitCreateNewGame}
                                                    winner={tttBoard.info.winner === 0}
                                                    contentPlayerOne="Player Win, Thank You For Playing"
                                                    contentPlayerTWo="Bot Win, Thank You For Playing"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </GamePanel>

                                <TTTBoard board={tttBoard.board} handleOnClick={handleEmitAddMove} register={chessBoardRef} />
                            </div>
                        </>
                    ) : (
                        <div>
                            <WaveLoading />
                        </div>
                    )}
                </div>
            </RouteProtectedWrapper>
        </>
    );
};

export default TicTacToeBot;
