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
import ShareIcon from '../../../public/asset/icons/share';
import useChatIo from '../../../common/hooks/useChatIo';
import useGameTTT from '../../../common/hooks/useGameTTT';
import { GameStatus } from '../../../common/interface/game.interface';
import GameControlMenu from '../../../components/game/game-menu';
import GameTopMenu from '../../../components/game/game-top-menu';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const {
        tttBoard,
        tttPlayers,
        tttBoardRef,
        tttHandleOnAddMove,
        tttHandleOnReady,
        tttHandleOnRestart,
        tttHandleOnStart,
        currentTTTPlayer,
        tttHandleOnAcceptDraw,
        tttHandleOnCreateDraw,
        tttHandleOnSurrender,
    } = useGameTTT(roomId);
    const { chat, chatRegister, handleOnSendChatMessage, chatWrapperRef } = useChatIo(tttBoard?.chatId);

    return (
        <>
            <SeoHead {...routers.ticTacToePvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {tttBoard && (
                        <div className="justify-center py-2 space-y-2 lg:space-y-0 lg:space-x-2 lg:flex">
                            <div className="w-full max-w-2xl mx-auto space-y-2 md:mx-0">
                                <div className="flex flex-col justify-between p-2 bg-gray-50">
                                    <GameTopMenu boardId={tttBoard.id} />

                                    <div className="flex">
                                        <PlayerInfo player={tttPlayers?.length ? tttPlayers[0] : tttBoard.users[0]} isReverse={false} />
                                        <TTTTurn
                                            currentTurn={tttBoard.currentTurn}
                                            userOneReady={tttBoard.users[0]?.ready}
                                            userTwoReady={tttBoard.users[1]?.ready}
                                        />
                                        <PlayerInfo player={tttPlayers?.length ? tttPlayers[1] : tttBoard.users[1]} isReverse={true} />
                                    </div>
                                </div>
                                <div className="relative m-auto ttt-board">
                                    <PanelStart
                                        handleOnClick={tttHandleOnStart}
                                        isAppear={tttBoard.status === GameStatus.NOT_YET && tttBoard.users[0]?.ready && tttBoard.users[1]?.ready}
                                    />
                                    <PanelReady
                                        isReady={true}
                                        handleOnClick={tttHandleOnReady}
                                        isAppear={tttBoard.status === GameStatus.NOT_YET && (!tttBoard.users[0]?.ready || !tttBoard.users[1]?.ready)}
                                    />
                                    <PanelRestart
                                        handleOnClick={tttHandleOnRestart}
                                        winner={tttBoard.winner}
                                        userOneName={tttBoard.users[0]?.name ? tttBoard.users[0].name : ''}
                                        userTwoName={tttBoard.users[1]?.name ? tttBoard.users[1].name : ''}
                                        isAppear={tttBoard.status === GameStatus['END']}
                                    />

                                    <PanelDraw
                                        handleOnAccept={() => tttHandleOnAcceptDraw(true)}
                                        handleOnDeny={() => tttHandleOnAcceptDraw(false)}
                                        isAppear={tttBoard.status === GameStatus.DRAW}
                                        isDraw={currentTTTPlayer.isDraw}
                                    />
                                    <TTTBoard board={tttBoard.board} handleOnClick={tttHandleOnAddMove} register={tttBoardRef} />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 space-y-2 md:m-0 md:max-w-xs">
                                <GameControlMenu
                                    handleOnDraw={tttHandleOnCreateDraw}
                                    handleOnSurrender={tttHandleOnSurrender}
                                    isBotMode={tttBoard.isBotMode}
                                />
                                {chat && (
                                    <ChatBox
                                        wrapperRef={chatWrapperRef}
                                        chat={chat}
                                        handleOnSendMessage={handleOnSendChatMessage}
                                        register={chatRegister}
                                        users={tttBoard.users}
                                    />
                                )}
                            </div>
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
