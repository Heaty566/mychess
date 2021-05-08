import * as React from 'react';

import { TicTacToeStatus } from '../../../common/interface/tic-tac-toe.interface';
import routers from '../../../common/constants/router';
import SeoHead from '../../../components/common/seoHead';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { copy } from '../../../common/helpers/copy';

import RouteProtectedWrapper from '../../../common/HOC/routeProtectedWrapper';
import ToolTip from '../../../components/tooltip/tooltip-dropbox';
import TTTBoard from '../../../components/game/ttt-board';
import PlayerInfo from '../../../components/game/player-info';
import GameTurn from '../../../components/game/game-turn';
import GamePanel from '../../../components/game/panel-wrapper';
import PanelRestart from '../../../components/game/panel-restart';
import WaveLoading from '../../../components/loading/wave-loading';
import PanelStart from '../../../components/game/panel-start';
import PanelReady from '../../../components/game/panel-ready';
import XPlayerIcon from '../../../public/asset/icons/x-player';
import OPlayerIcon from '../../../public/asset/icons/o-player';
import ShareIcon from '../../../public/asset/icons/share';
import useChatIo from '../../../common/hooks/useChatIo';
import useGameTTT from '../../../common/hooks/useGameTTT';

export interface TicTacToePvPProps {
    roomId: string;
}

const TicTacToePvP: React.FunctionComponent<TicTacToePvPProps> = ({ roomId }) => {
    const [chatId, setChatId] = React.useState<string>();
    const [board, boardRef, handleOnReady, handleOnStart, handleOnAddMove, handleOnRestart] = useGameTTT(roomId);
    const [chat, chatRegister, handleOnSendMessage] = useChatIo(chatId);

    return (
        <>
            <SeoHead {...routers.ticTacToePvP.header} />
            <RouteProtectedWrapper isNeedLogin>
                <div className="flex-1 space-y-4 md:p-8 fade-in chess-bg">
                    {board && (
                        <>
                            <div className="flex flex-wrap justify-between max-w-2xl p-2 mx-auto bg-gray-50">
                                <div className="flex justify-between w-full mb-2 ">
                                    <p className="text-lg font-bold">Room ID: {board.id}</p>
                                    <div>
                                        <ToolTip content="Copy To Clipboard" position="left-full" maxLength={0}>
                                            <button className="flex font-semibold focus:outline-none" onClick={() => copy(window.location.href)}>
                                                <ShareIcon />
                                                <span className="ml-1">Share</span>
                                            </button>
                                        </ToolTip>
                                    </div>
                                </div>
                                <PlayerInfo player={board.users[0]} isReverse={false} time={board.users[0]?.time} />

                                <div className="flex items-center px-2 space-x-4 ">
                                    <div className="flex items-center justify-center w-8 h-8 border-2 ">
                                        {board.users[0]?.ready && <OPlayerIcon />}
                                    </div>
                                    <GameTurn currentTurn={board.currentTurn} SymbolOne={OPlayerIcon} SymbolTwo={XPlayerIcon} />
                                    <div className="flex items-center justify-center w-8 h-8 border-2 ">
                                        {board.users[1]?.ready && <XPlayerIcon />}
                                    </div>
                                </div>

                                <PlayerInfo player={board.users[1]} time={board.users[1]?.time} isReverse={true} />
                            </div>
                            <div className="relative m-auto ttt-board">
                                <GamePanel isAppear={board.status !== TicTacToeStatus['PLAYING']}>
                                    <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-20">
                                        <div className="p-5 m-2 space-y-2 text-center rounded-sm bg-warmGray-50">
                                            {board.status === TicTacToeStatus['NOT-YET'] && board.users[0]?.ready && board.users[1]?.ready && (
                                                <PanelStart handleOnClick={handleOnStart} />
                                            )}
                                            {board.status === TicTacToeStatus['NOT-YET'] && (!board.users[0]?.ready || !board.users[1]?.ready) && (
                                                <PanelReady isReady={true} handleOnClick={handleOnReady} />
                                            )}

                                            {board.status === TicTacToeStatus['END'] && (
                                                <PanelRestart
                                                    handleOnClick={handleOnRestart}
                                                    winner={board.winner === 0}
                                                    userOneName={board.users[0] && board.users[0].name ? board.users[0].name : ''}
                                                    userTwoName={board.users[1] && board.users[1].name ? board.users[1].name : ''}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </GamePanel>

                                <TTTBoard board={board.board} handleOnClick={handleOnAddMove} register={boardRef} />
                            </div>
                        </>
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
