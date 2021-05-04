import * as React from 'react';
import { useSelector } from 'react-redux';

import { TTTAction, TicTacToeStatus, TicTacToeBoard } from '../../../components/game/tttBoard/config';
import { RoomIdDto } from '../../../common/interface/dto/roomIdDto';
import { useSocketIo } from '../../../common/hooks/useSocketIo';
import { AuthState } from '../../../store/auth/interface';
import { ServerResponse } from '../../../store/api/interface';
import { RootState } from '../../../store';
import routers from '../../../common/constants/router';
import SeoHead from '../../../components/common/seoHead';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import ticTacToeApi from '../../../api/ticTacToe';
import { copy } from '../../../common/helpers/copy';

import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';
import ToolTip from '../../../components/tooltip';
import TTTBoard from '../../../components/game/tttBoard';
import PlayerInfo from '../../../components/game/playerInfo';
import GameTurn from '../../../components/game/gameTurn';
import GamePanel from '../../../components/game/panel';
import PanelRestart from '../../../components/game/panel/panelRestart';
import WaveLoading from '../../../components/loading/waveLoading';
import PanelStart from '../../../components/game/panel/panelStart';
import PanelReady from '../../../components/game/panel/panelReady';
import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import ShareIcon from '../../../public/asset/icons/share';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const clientIoTTTBot = useSocketIo({ namespace: 'tic-tac-toe' });
    const router = useRouter();
    const chessBoardRef = React.useRef<HTMLDivElement>(null);
    const [tttBoard, setTTTBoard] = React.useState<TicTacToeBoard>();
    const authState = useSelector<RootState, AuthState>((state) => state.auth);

    const onTTTGet = (res: ServerResponse<TicTacToeBoard>) => {
        setTTTBoard(res.data);
    };

    const onTTTCreate = (res: ServerResponse<RoomIdDto>) => {
        console.log('handle create');
        console.log(res);
        router.push(`${routers.ticTacToePvP.link}/${res.data.roomId}`);
    };

    const onTTTStart = () => {
        if (chessBoardRef.current) {
            const clientWidth = chessBoardRef.current.clientWidth / 2;
            const scrollCenter = chessBoardRef.current.scrollWidth / 2 - clientWidth;
            chessBoardRef.current.scrollLeft = scrollCenter;
        }

        if (roomId) clientIoTTTBot.emit(TTTAction.TTT_GET, { roomId });
    };

    const onTTTWin = () => {
        const sound = new Audio('/asset/sounds/end-game.mp3');
        sound.volume = 0.5;
        sound.play();
    };
    const emitTTTGet = () => {
        if (roomId) clientIoTTTBot.emit(TTTAction.TTT_GET, { roomId });
    };

    const handleEmitStart = () => {
        if (roomId) clientIoTTTBot.emit(TTTAction.TTT_START, { roomId });
    };
    const handleEmitReady = () => clientIoTTTBot.emit(TTTAction.TTT_READY, { roomId });

    const handleEmitAddMove = (x: number, y: number) => {
        const input = { roomId, x, y };
        const sound = new Audio('/asset/sounds/ttt_click.mp3');
        sound.volume = 0.3;
        sound.play();
        if (tttBoard?.isBotMode) clientIoTTTBot.emit(TTTAction.TTT_BOT_BEST_MOVE, input);
        else clientIoTTTBot.emit(TTTAction.TTT_ADD_MOVE, input);
    };

    const handleNewGame = () => {
        if (tttBoard?.isBotMode)
            ticTacToeApi.createBot().then((res) => {
                const roomId = res.data.data.roomId;
                router.push(`${routers.ticTacToePvP.link}/${roomId}`);
            });
        else {
            clientIoTTTBot.emit(TTTAction.TTT_CREATE, { roomId });
        }
    };

    React.useEffect(() => {
        return () => {
            clientIoTTTBot.emit(TTTAction.TTT_SURRENDER, { roomId });
            clientIoTTTBot.emit(TTTAction.TTT_LEAVE, { roomId });
        };
    }, []);

    React.useEffect(() => {
        console.log(roomId);
        if (roomId)
            ticTacToeApi
                .joinRoom({ roomId })
                .then((res) => {
                    console.log(res);
                    if (authState.isSocketLogin) clientIoTTTBot.emit(TTTAction.TTT_JOIN, { roomId });
                })
                .catch(() => {
                    router.push('/404');
                });
    }, [authState.isSocketLogin, roomId]);

    React.useEffect(() => {
        clientIoTTTBot.on(TTTAction.TTT_START, onTTTStart);
        clientIoTTTBot.on(TTTAction.TTT_WIN, onTTTWin);
        clientIoTTTBot.on(TTTAction.TTT_GET, onTTTGet);
        clientIoTTTBot.on(TTTAction.TTT_LEAVE, emitTTTGet);
        clientIoTTTBot.on(TTTAction.TTT_JOIN, emitTTTGet);
        clientIoTTTBot.on(TTTAction.TTT_READY, emitTTTGet);
        clientIoTTTBot.on(TTTAction.TTT_ADD_MOVE, emitTTTGet);
        clientIoTTTBot.on(TTTAction.TTT_BOT_BEST_MOVE, emitTTTGet);
        clientIoTTTBot.on(TTTAction.TTT_CREATE, onTTTCreate);

        return () => {
            clientIoTTTBot.off(TTTAction.TTT_CREATE, onTTTCreate);
            clientIoTTTBot.off(TTTAction.TTT_START, onTTTStart);
            clientIoTTTBot.off(TTTAction.TTT_READY, emitTTTGet);
            clientIoTTTBot.off(TTTAction.TTT_WIN, onTTTWin);
            clientIoTTTBot.off(TTTAction.TTT_ADD_MOVE, emitTTTGet);
            clientIoTTTBot.off(TTTAction.TTT_GET, onTTTGet);
            clientIoTTTBot.off(TTTAction.TTT_LEAVE, emitTTTGet);
            clientIoTTTBot.off(TTTAction.TTT_BOT_BEST_MOVE, emitTTTGet);
            clientIoTTTBot.off(TTTAction.TTT_JOIN, emitTTTGet);
        };
    }, [roomId]);

    return (
        <>
            <SeoHead {...routers.ticTacToePvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {tttBoard ? (
                        <>
                            <div className="flex flex-wrap justify-between max-w-2xl p-2 mx-auto bg-gray-50">
                                <div className="flex justify-between w-full mb-2 ">
                                    <p className="text-lg font-bold">Room ID: {tttBoard.id}</p>
                                    <div>
                                        <ToolTip content="Copy To Clipboard" position="left-full" maxLength={0}>
                                            <button className="flex font-semibold focus:outline-none" onClick={() => copy(window.location.href)}>
                                                <ShareIcon />
                                                <span className="ml-1">Share</span>
                                            </button>
                                        </ToolTip>
                                    </div>
                                </div>
                                <PlayerInfo player={tttBoard.info.users[0]} isReverse={false} time={tttBoard.users[0].time} />

                                <div className="flex items-center px-2 space-x-4 ">
                                    <div className="flex items-center justify-center w-8 h-8 border-2 ">
                                        {tttBoard.users[0].ready && <OPlayerIcon />}
                                    </div>
                                    <GameTurn currentTurn={tttBoard.currentTurn} SymbolOne={OPlayerIcon} SymbolTwo={XPlayerIcon} />
                                    <div className="flex items-center justify-center w-8 h-8 border-2 ">
                                        {tttBoard.users[1].ready && <XPlayerIcon />}
                                    </div>
                                </div>

                                <PlayerInfo player={tttBoard.info.users[1]} time={tttBoard.users[1].time} isReverse={true} />
                            </div>
                            <div className="relative m-auto ttt-board">
                                <GamePanel isAppear={tttBoard.info.status !== TicTacToeStatus['PLAYING']}>
                                    <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-20">
                                        <div className="p-5 m-2 space-y-2 text-center rounded-sm bg-warmGray-50">
                                            {tttBoard.info.status === TicTacToeStatus['NOT-YET'] &&
                                                tttBoard.users[0].ready &&
                                                tttBoard.users[1].ready && <PanelStart handleOnClick={() => handleEmitStart()} />}
                                            {tttBoard.info.status === TicTacToeStatus['NOT-YET'] &&
                                                (!tttBoard.users[0].ready || !tttBoard.users[1].ready) && (
                                                    <PanelReady isReady={true} handleOnClick={() => handleEmitReady()} />
                                                )}

                                            {tttBoard.info.status === TicTacToeStatus['END'] && (
                                                <PanelRestart
                                                    handleOnClick={() => handleNewGame()}
                                                    winner={tttBoard.info.winner === 0}
                                                    userOneName={
                                                        tttBoard.info.users[0] && tttBoard.info.users[0].name ? tttBoard.info.users[0].name : ''
                                                    }
                                                    userTwoName={
                                                        tttBoard.info.users[1] && tttBoard.info.users[1].name ? tttBoard.info.users[1].name : ''
                                                    }
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
    else return { props: { roomId } };
}

export default TicTacToePvP;
