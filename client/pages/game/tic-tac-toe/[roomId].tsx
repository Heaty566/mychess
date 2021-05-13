import * as React from 'react';

import routers from '../../../common/constants/router';
import SeoHead from '../../../components/common/seoHead';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { copy } from '../../../common/helpers/copy';

import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';
import ToolTip from '../../../components/tooltip/tooltip-dropbox';
import TTTBoard from '../../../components/game/ttt-board';
import PlayerInfo from '../../../components/game/player-info';
import TTTTurn from '../../../components/game/ttt-turn';
import ChatBox from '../../../components/chat';
import PanelRestart from '../../../components/game/panel-restart';
import WaveLoading from '../../../components/loading/wave-loading';
import PanelStart from '../../../components/game/panel-start';
import PanelReady from '../../../components/game/panel-ready';
import PanelDraw from '../../../components/game/panel-draw';
import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import ShareIcon from '../../../public/asset/icons/share';
import useChatIo from '../../../common/hooks/useChatIo';
import useGameTTT from '../../../common/hooks/useGameTTT';
import { GameStatus } from '../../../common/interface/game.interface';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const { tttBoard, players, chessBoardRef, handleOnReady, handleOnStart, handleOnAddMove, handleOnRestart } = useGameTTT(roomId);
    const [chat, chatRegister, chatWrapperRef, handleOnSendMessage] = useChatIo(tttBoard?.chatId);

    return (
        <>
            <SeoHead {...routers.ticTacToePvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {tttBoard && (
                        <div className="justify-center py-2 space-y-2 lg:space-y-0 lg:space-x-2 lg:flex">
                            <div className="w-full max-w-2xl mx-auto space-y-2 md:mx-0">
                                <div className="flex flex-col justify-between p-2 bg-gray-50">
                                    <div className="flex justify-between flex-1">
                                        <p className="text-lg font-bold">Room ID: {tttBoard.id}</p>

                                        <ToolTip content="Copy To Clipboard" position="left-full" maxLength={0}>
                                            <button
                                                className="flex font-semibold duration-200 focus:outline-none hover:text-blue-700"
                                                onClick={() => copy(window.location.href)}
                                            >
                                                <ShareIcon />
                                                <span className="ml-1">Share</span>
                                            </button>
                                        </ToolTip>
                                    </div>

                                    <div className="flex">
                                        <PlayerInfo player={players?.length ? players[0] : tttBoard.users[0]} isReverse={false} />
                                        <TTTTurn
                                            currentTurn={tttBoard.currentTurn}
                                            userOneReady={tttBoard.users[0]?.ready}
                                            userTwoReady={tttBoard.users[1]?.ready}
                                        />
                                        <PlayerInfo player={players?.length ? players[1] : tttBoard.users[1]} isReverse={true} />
                                    </div>
                                </div>
                                <div className="relative m-auto ttt-board">
                                    <PanelStart
                                        handleOnClick={handleOnStart}
                                        isAppear={tttBoard.status === GameStatus.NOT_YET && tttBoard.users[0]?.ready && tttBoard.users[1]?.ready}
                                    />

                                    <PanelReady
                                        isReady={true}
                                        handleOnClick={handleOnReady}
                                        isAppear={tttBoard.status === GameStatus.NOT_YET && (!tttBoard.users[0]?.ready || !tttBoard.users[1]?.ready)}
                                    />

                                    <PanelRestart
                                        handleOnClick={handleOnRestart}
                                        winner={tttBoard.winner === 0}
                                        userOneName={tttBoard.users[0]?.name ? tttBoard.users[0].name : ''}
                                        userTwoName={tttBoard.users[1]?.name ? tttBoard.users[1].name : ''}
                                        isAppear={tttBoard.status === GameStatus['END']}
                                    />
                                    {/* <PanelDraw handleOnAccept={() => {}} handleOnDeny={() => {}} isAppear={true} /> */}

                                    <TTTBoard board={tttBoard.board} handleOnClick={handleOnAddMove} register={chessBoardRef} />
                                </div>
                            </div>

                            {chat && (
                                <ChatBox
                                    wrapperRef={chatWrapperRef}
                                    chat={chat}
                                    handleOnSendMessage={handleOnSendMessage}
                                    register={chatRegister}
                                    users={tttBoard.users}
                                />
                            )}
                        </div>
                    )}

                    {!tttBoard && <WaveLoading />}
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
