import * as React from 'react';
import { useSelector } from 'react-redux';

import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import { TTTAction, TicTacToeStatus, TicTacToeBoard, TicTacToePlayer } from '../../../components/game/tttBoard/config';
import { RoomIdDto } from '../../../common/interface/dto/roomIdDto';
import { useSocketIo } from '../../../common/hooks/useSocketIo';
import { AuthState, User } from '../../../store/auth/interface';
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
import CheckIcon from '../../../public/asset/icons/check';
import SeoHead from '../../../components/common/seoHead';
import PanelStartPlayer from '../../../components/game/panel/panelStartPlayer';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const clientIoTTTBot = useSocketIo({ namespace: 'tic-tac-toe' });
    const router = useRouter();
    const [isStart, setStart] = React.useState(false);
    const chessBoardRef = React.useRef<HTMLDivElement>(null);
    const [tttBoard, setTTTBoard] = React.useState<TicTacToeBoard>();

    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const [currentPlayer, setCurrentPlayer] = React.useState<TicTacToePlayer>({ flag: -1, id: '', ready: false, time: 0 });

    React.useEffect(() => {
        return () => {
            clientIoTTTBot.emit(TTTAction.TTT_SURRENDER, { roomId });
            clientIoTTTBot.emit(TTTAction.TTT_LEAVE, { roomId });
        };
    }, []);

    React.useEffect(() => {
        if (authState.isLogin && tttBoard) {
            const user = tttBoard.users.find((item) => item.id === authState.id);
            if (user) setCurrentPlayer(user);
        }
    }, [authState.isLogin, tttBoard?.users]);

    const onTTTBotGet = (res: ServerResponse<TicTacToeBoard>) => {
        console.log(res.data);
        setTTTBoard(res.data);
    };
    const onTTTBotMove = () => clientIoTTTBot.emit(TTTAction.TTT_GET, { roomId });
    const onTTTBotCreate = (res: ServerResponse<RoomIdDto>) => {
        clientIoTTTBot.emit(TTTAction.TTT_GET, { roomId: res.data.roomId });
    };
    const onTTTBotStart = () => {
        if (chessBoardRef.current) {
            const clientWidth = chessBoardRef.current.clientWidth / 2;
            const scrollCenter = chessBoardRef.current.scrollWidth / 2 - clientWidth;
            chessBoardRef.current.scrollLeft = scrollCenter;
        }
        setStart(false);

        clientIoTTTBot.emit(TTTAction.TTT_GET, { roomId });
    };
    const onTTTBotWin = () => {
        const sound = new Audio('/asset/sounds/end-game.mp3');
        sound.volume = 0.5;
        sound.play();
    };
    const onLeave = () => {
        clientIoTTTBot.emit(TTTAction.TTT_GET, { roomId });
    };

    const handleEmitGet = () => {
        clientIoTTTBot.emit(TTTAction.TTT_GET, { roomId });
    };
    const handleEmitCreateNewGame = () => {
        clientIoTTTBot.emit(TTTAction.TTT_LEAVE, { roomId });
        clientIoTTTBot.emit(TTTAction.TTT_CREATE, {});
    };

    const handleEmitStart = () => clientIoTTTBot.emit(TTTAction.TTT_START, { roomId });
    const handleEmitReady = () => {
        console.log('ready');
        clientIoTTTBot.emit(TTTAction.TTT_READY, { roomId });
    };

    const handleEmitAddMove = (x: number, y: number) => {
        const input = { roomId, x, y };
        const sound = new Audio('/asset/sounds/ttt_click.mp3');
        sound.volume = 0.3;
        sound.play();
        clientIoTTTBot.emit(TTTAction.TTT_ADD_MOVE, input);
    };

    React.useEffect(() => {
        if (tttBoard && tttBoard.info.status === TicTacToeStatus['NOT-YET'] && tttBoard.users[0].ready && tttBoard.users[1].ready) {
            console.log('start');
            handleEmitStart();
        }
    }, [tttBoard?.users]);

    React.useEffect(() => {
        clientIoTTTBot.on(TTTAction.TTT_GET, onTTTBotGet);
        clientIoTTTBot.on(TTTAction.TTT_START, onTTTBotStart);
        clientIoTTTBot.on(TTTAction.TTT_ADD_MOVE, handleEmitGet);
        clientIoTTTBot.on(TTTAction.TTT_CREATE, onTTTBotCreate);
        clientIoTTTBot.on(TTTAction.TTT_WIN, onTTTBotWin);
        clientIoTTTBot.on(TTTAction.TTT_JOIN, handleEmitGet);
        clientIoTTTBot.on(TTTAction.TTT_LEAVE, handleEmitGet);
        clientIoTTTBot.on(TTTAction.TTT_READY, handleEmitGet);
        clientIoTTTBot.emit(TTTAction.TTT_JOIN, { roomId });
        return () => {
            clientIoTTTBot.off(TTTAction.TTT_GET, onTTTBotGet);
            clientIoTTTBot.off(TTTAction.TTT_START, onTTTBotStart);
            clientIoTTTBot.off(TTTAction.TTT_ADD_MOVE, handleEmitGet);
            clientIoTTTBot.off(TTTAction.TTT_CREATE, onTTTBotCreate);
            clientIoTTTBot.off(TTTAction.TTT_WIN, onTTTBotWin);
            clientIoTTTBot.off(TTTAction.TTT_JOIN, handleEmitGet);
            clientIoTTTBot.off(TTTAction.TTT_LEAVE, handleEmitGet);
            clientIoTTTBot.off(TTTAction.TTT_READY, handleEmitGet);
        };
    }, [roomId, authState.isSocketLogin]);

    return (
        <>
            <SeoHead {...routers.ticTacToePvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {tttBoard ? (
                        <>
                            <div className="flex justify-between max-w-2xl p-2 mx-auto bg-gray-50">
                                <PlayerInfo player={tttBoard.info.users[0]} isReverse={false} />
                                {/* {tttBoard.info.users.length !== 2 ? (
                                    <div className="flex items-center justify-around flex-1">
                                        <WaveLoading />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex">
                                            <div className="flex items-center justify-center w-8 h-8 border-2 border-black">
                                                {tttBoard.users[0].ready && <CheckIcon />}
                                            </div>
                                            <GameTurn currentTurn={tttBoard.currentTurn} SymbolOne={OPlayerIcon} SymbolTwo={XPlayerIcon} />
                                            <div className="flex items-center justify-center w-8 h-8 border-2 border-black">
                                                {tttBoard.users[1].ready && <CheckIcon />}
                                            </div>
                                        </div>
                                    </>
                                )} */}
                                <div className="flex items-center px-2">
                                    <div className="flex items-center justify-center w-8 h-8 border-2 border-black">
                                        {tttBoard.users[0].ready && <CheckIcon />}
                                    </div>
                                    <GameTurn currentTurn={tttBoard.currentTurn} SymbolOne={OPlayerIcon} SymbolTwo={XPlayerIcon} />
                                    <div className="flex items-center justify-center w-8 h-8 border-2 border-black">
                                        {tttBoard.users[1].ready && <CheckIcon />}
                                    </div>
                                </div>

                                <PlayerInfo player={tttBoard.info.users[1]} isReverse={true} />
                            </div>
                            <div className="relative m-auto ttt-board">
                                <GamePanel isAppear={tttBoard.info.status !== TicTacToeStatus['PLAYING']}>
                                    <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-20">
                                        <div className="p-5 m-2 space-y-2 text-center rounded-sm bg-warmGray-50">
                                            {tttBoard.info.status === TicTacToeStatus['NOT-YET'] && (
                                                <PanelStartPlayer handleOnClick={handleEmitReady} isReady={currentPlayer.ready} />
                                            )}
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

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ roomId: string }>,
): Promise<GetServerSidePropsResult<TicTacToePvPProps>> {
    const roomId = context.params?.roomId;
    if (!roomId) return { redirect: { destination: '/404', permanent: false } };
    else {
        try {
            await axios.post<ServerResponse<null>>(`${process.env.SERVER_INTER_URL}/api/tic-tac-toe/check-room`, { roomId });

            return { props: { roomId } };
        } catch (err) {
            return { redirect: { destination: '/404', permanent: false } };
        }
    }
}

export default TicTacToePvP;
