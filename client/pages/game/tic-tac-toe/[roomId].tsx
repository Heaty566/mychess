import * as React from 'react';
import { useSelector } from 'react-redux';

import { TTTGatewayAction, TicTacToeStatus, TicTacToeBoard, ChatGatewayAction, Chat } from '../../../components/game/tttBoard/config';
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
import chatApi from '../../../api/chat';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const clientIoTTT = useSocketIo({ namespace: 'tic-tac-toe' });
    const clientIoChat = useSocketIo({ namespace: 'chats' });
    const router = useRouter();
    const chessBoardRef = React.useRef<HTMLDivElement>(null);
    const [tttBoard, setTTTBoard] = React.useState<TicTacToeBoard>();
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const [chatId, setChatId] = React.useState<string>();
    const [chat, setChat] = React.useState<Chat>();

    const onTTTGet = (res: ServerResponse<TicTacToeBoard>) => setTTTBoard(res.data);
    const onChatGet = (res: ServerResponse<Chat>) => {
        console.log(res.data);
        setChat(res.data);
    };

    const handleOnRestart = () => {
        if (tttBoard) {
            if (tttBoard.isBotMode)
                ticTacToeApi.createNewBotRoom().then((res) => {
                    const roomId = res.data.data.roomId;
                    router.push(`${routers.ticTacToePvP.link}/${roomId}`);
                });
            else ticTacToeApi.restartGame({ roomId });
        }
    };

    React.useEffect(() => {
        if (tttBoard && tttBoard.status === TicTacToeStatus.END) {
            const sound = new Audio('/asset/sounds/end-game.mp3');
            sound.volume = 0.5;
            sound.play();
        }
    }, [tttBoard?.status]);

    const emitTTTGet = () => clientIoTTT.emit(TTTGatewayAction.TTT_GET, { roomId });
    const emitChatGet = () => clientIoChat.emit(ChatGatewayAction.CHAT_GET, { chatId });

    React.useEffect(() => {
        if (roomId && authState.isSocketLogin)
            ticTacToeApi
                .joinRoom({ roomId })
                .then((res) => clientIoTTT.emit(TTTGatewayAction.TTT_JOIN, { roomId }))
                .catch(() => router.push('/404'));
    }, [authState.isSocketLogin, roomId, chatId]);

    React.useEffect(() => {
        if (tttBoard?.chatId)
            chatApi.joinChat({ chatId: tttBoard?.chatId }).then((res) => {
                setChatId(res.data.data.chatId);
                const input = { chatId: res.data.data.chatId };
                clientIoChat.emit(ChatGatewayAction.CHAT_JOIN, input);
            });
    }, [tttBoard?.chatId]);

    const handleOnStart = () => {
        ticTacToeApi
            .startGame({ roomId })
            .then(() => {
                if (chessBoardRef.current) {
                    const clientWidth = chessBoardRef.current.clientWidth / 2;
                    const scrollCenter = chessBoardRef.current.scrollWidth / 2 - clientWidth;
                    chessBoardRef.current.scrollLeft = scrollCenter;
                }
            })
            .catch(() => router.push('/404'));
    };

    const handleOnAddMove = (x: number, y: number) => ticTacToeApi.addMovePvP({ roomId, x, y });
    const handleOnReady = () => ticTacToeApi.readyGame({ roomId });
    const onRestartGame = (res: ServerResponse<TicTacToeBoard>) => router.push(`${routers.ticTacToePvP.link}/${res.data.id}`);

    React.useEffect(() => {
        return () => {
            ticTacToeApi.leaveGame({ roomId });
        };
    }, [roomId]);

    React.useEffect(() => {
        clientIoChat.on(ChatGatewayAction.CHAT_JOIN, emitChatGet);
        clientIoChat.on(ChatGatewayAction.CHAT_GET, onChatGet);
        clientIoTTT.on(TTTGatewayAction.TTT_GET, onTTTGet);
        clientIoTTT.on(TTTGatewayAction.TTT_JOIN, emitTTTGet);
        clientIoTTT.on(TTTGatewayAction.TTT_RESTART, onRestartGame);

        return () => {
            clientIoChat.off(ChatGatewayAction.CHAT_JOIN, emitChatGet);
            clientIoChat.off(ChatGatewayAction.CHAT_GET, onChatGet);
            clientIoTTT.off(TTTGatewayAction.TTT_RESTART, onRestartGame);
            clientIoTTT.off(TTTGatewayAction.TTT_GET, onTTTGet);
            clientIoTTT.off(TTTGatewayAction.TTT_JOIN, emitTTTGet);
        };
    }, [roomId, chatId]);

    const handleOnSendMessage = (event: Event) => {
        event.preventDefault();
        if (chatId) chatApi.sendMessageChat({ chatId, content: 'hello world' });

        console.log('hello');
    };

    return (
        <>
            <SeoHead {...routers.ticTacToePvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {tttBoard ? (
                        <>
                            <div className="min-h-full p-2 bg-gray-600">
                                <div>
                                    {chat?.messages.map((item) => {
                                        return <p className="bg-red-500">{item.content}</p>;
                                    })}
                                </div>
                                <form onSubmit={handleOnSendMessage}>
                                    <input />
                                    <button className="p-2 bg-blue-200">send</button>
                                </form>
                            </div>
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
                                <PlayerInfo player={tttBoard.users[0]} isReverse={false} time={tttBoard.users[0]?.time} />

                                <div className="flex items-center px-2 space-x-4 ">
                                    <div className="flex items-center justify-center w-8 h-8 border-2 ">
                                        {tttBoard.users[0]?.ready && <OPlayerIcon />}
                                    </div>
                                    <GameTurn currentTurn={tttBoard.currentTurn} SymbolOne={OPlayerIcon} SymbolTwo={XPlayerIcon} />
                                    <div className="flex items-center justify-center w-8 h-8 border-2 ">
                                        {tttBoard.users[1]?.ready && <XPlayerIcon />}
                                    </div>
                                </div>

                                <PlayerInfo player={tttBoard.users[1]} time={tttBoard.users[1]?.time} isReverse={true} />
                            </div>
                            <div className="relative m-auto ttt-board">
                                <GamePanel isAppear={tttBoard.status !== TicTacToeStatus['PLAYING']}>
                                    <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-20">
                                        <div className="p-5 m-2 space-y-2 text-center rounded-sm bg-warmGray-50">
                                            {tttBoard.status === TicTacToeStatus['NOT-YET'] &&
                                                tttBoard.users[0]?.ready &&
                                                tttBoard.users[1]?.ready && <PanelStart handleOnClick={handleOnStart} />}
                                            {tttBoard.status === TicTacToeStatus['NOT-YET'] &&
                                                (!tttBoard.users[0]?.ready || !tttBoard.users[1]?.ready) && (
                                                    <PanelReady isReady={true} handleOnClick={handleOnReady} />
                                                )}

                                            {tttBoard.status === TicTacToeStatus['END'] && (
                                                <PanelRestart
                                                    handleOnClick={handleOnRestart}
                                                    winner={tttBoard.winner === 0}
                                                    userOneName={tttBoard.users[0] && tttBoard.users[0].name ? tttBoard.users[0].name : ''}
                                                    userTwoName={tttBoard.users[1] && tttBoard.users[1].name ? tttBoard.users[1].name : ''}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </GamePanel>

                                <TTTBoard board={tttBoard.board} handleOnClick={handleOnAddMove} register={chessBoardRef} />
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
