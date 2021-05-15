import * as React from 'react';

import routers from '../../../common/constants/router';
import SeoHead from '../../../components/common/seoHead';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { copy } from '../../../common/helpers/copy';

import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';
import ToolTip from '../../../components/tooltip/tooltip-dropbox';
import TTTBoard from '../../../components/game/ttt-board';
import PlayerInfo from '../../../components/game/player-info';
import ChessTurn from '../../../components/game/chess-turn';
import ChatBox from '../../../components/chat';
import PanelRestart from '../../../components/game/panel-restart';
import WaveLoading from '../../../components/loading/wave-loading';
import PanelStart from '../../../components/game/panel-start';
import PanelReady from '../../../components/game/panel-ready';

import ShareIcon from '../../../public/asset/icons/share';
import useChatIo from '../../../common/hooks/useChatIo';

import { useGameChess } from '../../../common/hooks/useGameChess';
import ChessBoard from '../../../components/game/chess-board';
import PanelDraw from '../../../components/game/panel-draw';
import ChessStep from '../../../components/game/chess-step';
import GameControlMenu from '../../../components/game/game-menu';
import PanelPromote from '../../../components/game/panel-promote';
import { GamePlayerFlag, GameStatus } from '../../../common/interface/game.interface';
import GameTopMenu from '../../../components/game/game-top-menu';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const {
        chessBoard,
        isChessPromote,
        chessPlayers,
        chessSuggestion,
        currentChessPlayer,
        chessBoardRef,
        chessHandleOnAcceptDraw,
        chessHandleOnDraw,
        chessHandleOnPromote,
        chessHandleOnReady,
        chessHandleOnRestart,
        chessHandleOnStart,
        chessHandleOnSurrender,
        chessHandleOnClick,
    } = useGameChess(roomId);
    const { chat, chatRegister, chatWrapperRef, handleOnSendChatMessage } = useChatIo(chessBoard?.chatId);

    return (
        <>
            <SeoHead {...routers.chessPvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {chessBoard && (
                        <div className="justify-center py-2 space-y-2 lg:space-y-0 lg:space-x-2 lg:flex">
                            <div className="w-full max-w-2xl mx-auto space-y-2 md:mx-0">
                                <div className="flex flex-col justify-between p-2 bg-gray-50">
                                    <GameTopMenu boardId={chessBoard.id} />

                                    <div className="flex">
                                        <PlayerInfo player={chessPlayers?.length ? chessPlayers[0] : chessBoard.users[0]} isReverse={false} />
                                        <ChessTurn
                                            currentTurn={chessBoard.turn}
                                            userOneReady={chessBoard.users[0]?.ready}
                                            userTwoReady={chessBoard.users[1]?.ready}
                                        />
                                        <PlayerInfo player={chessPlayers?.length ? chessPlayers[1] : chessBoard.users[1]} isReverse={true} />
                                    </div>
                                </div>
                                <div className="relative m-auto chess-board">
                                    <PanelStart
                                        handleOnClick={chessHandleOnStart}
                                        isAppear={
                                            chessBoard.status === GameStatus.NOT_YET && chessBoard.users[0]?.ready && chessBoard.users[1]?.ready
                                        }
                                    />

                                    <PanelReady
                                        isReady={true}
                                        handleOnClick={chessHandleOnReady}
                                        isAppear={
                                            chessBoard.status === GameStatus.NOT_YET && (!chessBoard.users[0]?.ready || !chessBoard.users[1]?.ready)
                                        }
                                    />

                                    <PanelRestart
                                        handleOnClick={chessHandleOnRestart}
                                        winner={chessBoard.winner}
                                        userOneName={chessBoard.users[0]?.name ? chessBoard.users[0].name : ''}
                                        userTwoName={chessBoard.users[1]?.name ? chessBoard.users[1].name : ''}
                                        isAppear={chessBoard.status === GameStatus.END}
                                    />
                                    <PanelDraw
                                        handleOnAccept={() => chessHandleOnAcceptDraw(true)}
                                        handleOnDeny={() => chessHandleOnAcceptDraw(false)}
                                        isAppear={chessBoard.status === GameStatus.DRAW}
                                        isDraw={currentChessPlayer.isDraw}
                                    />
                                    <PanelPromote
                                        currentFlag={currentChessPlayer?.flag || GamePlayerFlag.USER1}
                                        handleOnClick={chessHandleOnPromote}
                                        isAppear={isChessPromote}
                                    />
                                    <ChessBoard
                                        board={chessBoard.board}
                                        handleOnClick={chessHandleOnClick}
                                        kingCheck={chessBoard.checkedPiece}
                                        register={chessBoardRef}
                                        suggestion={chessSuggestion}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 space-y-2 md:m-0 md:max-w-xs">
                                <GameControlMenu
                                    handleOnDraw={chessHandleOnDraw}
                                    handleOnSurrender={chessHandleOnSurrender}
                                    isBotMode={chessBoard.isBotMode}
                                />
                                {chat && (
                                    <ChatBox
                                        wrapperRef={chatWrapperRef}
                                        chat={chat}
                                        handleOnSendMessage={handleOnSendChatMessage}
                                        register={chatRegister}
                                        users={chessBoard.users}
                                    />
                                )}
                                <ChessStep moves={chessBoard.moves} />
                            </div>
                        </div>
                    )}

                    {!chessBoard && <WaveLoading />}
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
