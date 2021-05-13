import * as React from 'react';

import { TicTacToeFlag, TicTacToeStatus } from '../../../common/interface/tic-tac-toe.interface';
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
import { ChessStatus } from '../../../common/interface/chess.interface';
import ChessBoard from '../../../components/game/chess-board';
import PanelDraw from '../../../components/game/panel-draw';
import ChessStep from '../../../components/game/chess-step';
import GameControlMenu from '../../../components/game/game-menu';
import PanelPromote from '../../../components/game/panel-promote';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const [
        board,
        players,
        player,
        suggestion,
        boardRef,
        handleOnReady,
        handleOnStart,
        handleOnAddMove,
        handleOnDraw,
        handleOnAcceptDraw,
        handleOnRestart,
        handleOnPromote,
        isPromote,
        handlsusu,
    ] = useGameChess(roomId);
    const [chat, chatRegister, chatWrapperRef, handleOnSendMessage] = useChatIo(board?.chatId);

    return (
        <>
            <SeoHead {...routers.chessPvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {board && (
                        <div className="justify-center py-2 space-y-2 lg:space-y-0 lg:space-x-2 lg:flex">
                            <div className="w-full max-w-2xl mx-auto space-y-2 md:mx-0">
                                <div className="flex flex-col justify-between p-2 bg-gray-50">
                                    <div className="flex justify-between flex-1">
                                        <p className="text-lg font-bold">Room ID: {board.id}</p>

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
                                        <PlayerInfo player={players?.length ? players[0] : board.users[0]} isReverse={false} />
                                        <ChessTurn
                                            currentTurn={board.turn}
                                            userOneReady={board.users[0]?.ready}
                                            userTwoReady={board.users[1]?.ready}
                                        />
                                        <PlayerInfo player={players?.length ? players[1] : board.users[1]} isReverse={true} />
                                    </div>
                                </div>
                                <div className="relative m-auto chess-board">
                                    <PanelStart
                                        handleOnClick={handleOnStart}
                                        isAppear={board.status === ChessStatus.NOT_YET && board.users[0]?.ready && board.users[1]?.ready}
                                    />

                                    <PanelReady
                                        isReady={true}
                                        handleOnClick={handleOnReady}
                                        isAppear={board.status === ChessStatus.NOT_YET && (!board.users[0]?.ready || !board.users[1]?.ready)}
                                    />

                                    <PanelRestart
                                        handleOnClick={handleOnRestart}
                                        winner={board.winner === 0}
                                        userOneName={board.users[0]?.name ? board.users[0].name : ''}
                                        userTwoName={board.users[1]?.name ? board.users[1].name : ''}
                                        isAppear={board.status === ChessStatus.END}
                                    />
                                    <PanelDraw
                                        handleOnAccept={() => handleOnAcceptDraw(true)}
                                        handleOnDeny={() => handleOnAcceptDraw(false)}
                                        isAppear={board.status === ChessStatus.DRAW}
                                        isDraw={player?.isDraw || false}
                                    />
                                    <PanelPromote
                                        currentFlag={player?.flag || TicTacToeFlag.BLUE}
                                        handleOnClick={handleOnPromote}
                                        isAppear={isPromote}
                                    />
                                    <ChessBoard board={board.board} handleOnClick={handleOnAddMove} register={boardRef} suggestion={suggestion} />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 space-y-2 md:m-0 md:max-w-xs">
                                <GameControlMenu handleOnDraw={handleOnDraw} handleOnSurrender={handlsusu} />
                                {chat && (
                                    <ChatBox
                                        wrapperRef={chatWrapperRef}
                                        chat={chat}
                                        handleOnSendMessage={handleOnSendMessage}
                                        register={chatRegister}
                                        users={board.users}
                                    />
                                )}
                                <ChessStep moves={board.moves} />
                            </div>
                        </div>
                    )}

                    {!board && <WaveLoading />}
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
