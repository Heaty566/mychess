import * as React from 'react';

import { GamePlayer, GamePlayerFlag, GameStatus } from '../interface/game.interface';
import { TTTGatewayAction, TicTacToeBoard } from '../interface/tic-tac-toe.interface';
import { AuthState } from '../interface/user.interface';
import { RootState } from '../../store';
import { ServerResponse } from '../interface/api.interface';
import routers from '../constants/router';
import ticTacToeApi from '../../api/tttApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import * as socketIo from 'socket.io-client';

const playerDefault: GamePlayer = {
    avatarUrl: '/asset/images/default-avatar.png',
    createDate: '',
    elo: 0,
    flag: GamePlayerFlag.USER1,
    id: '',
    isDraw: false,
    name: '',
    ready: false,
    time: 0,
    username: '',
};

const tttRow: Array<GamePlayerFlag> = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

const ticTacToeBoardDefault: TicTacToeBoard = {
    board: [
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
        [...tttRow],
    ],
    chatId: '',
    currentTurn: false,
    id: '',
    changeOne: 0,
    moves: [],
    changeTwo: 0,
    isBotMode: false,
    lastStep: new Date(),
    startDate: new Date(),
    status: GameStatus.NOT_YET,
    users: [playerDefault, playerDefault],
    winner: GamePlayerFlag.EMPTY,
};

const clientIoTTT = socketIo.connect(`${process.env.SERVER_URL}/tic-tac-toe`, { path: process.env.SOCKET_PATH });
export function useGameTTT(roomId: string) {
    const router = useRouter();
    const tttBoardRef = React.useRef<HTMLDivElement>(null);
    const [tttBoard, setTTTBoard] = React.useState<TicTacToeBoard>(ticTacToeBoardDefault);
    const [tttPlayers, setTTTPlayers] = React.useState<GamePlayer[]>(ticTacToeBoardDefault.users);
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const [currentTTTPlayer, setCurrentTTTPlayer] = React.useState<GamePlayer>(playerDefault);

    const tttHandleOnRestart = () => {
        if (tttBoard.isBotMode)
            ticTacToeApi.createNewBotRoom().then((res) => {
                const roomId = res.data.data.roomId;
                router.push(`${routers.ticTacToePvP.link}/${roomId}`);
            });
        else ticTacToeApi.restartGame({ roomId });
    };

    const tttHandleOnStart = () =>
        ticTacToeApi
            .startGame({ roomId })
            .then(() => {
                if (tttBoardRef.current) {
                    const clientWidth = tttBoardRef.current.clientWidth / 2;
                    const scrollCenter = tttBoardRef.current.scrollWidth / 2 - clientWidth;
                    tttBoardRef.current.scrollLeft = scrollCenter;
                }
            })
            .catch(() => router.push(routers[404].link));

    const tttHandleOnAddMove = (x: number, y: number) => {
        const sound = new Audio('/asset/sounds/ttt-click.mp3');
        sound.volume = 0.5;
        sound.play();
        ticTacToeApi.addMovePvP({ roomId, x, y });
    };
    const tttHandleOnCreateDraw = () => ticTacToeApi.drawGameCreate({ roomId });
    const tttHandleOnAcceptDraw = (isDraw: boolean) => ticTacToeApi.drawGameAccept({ roomId, isAccept: isDraw });
    const tttHandleOnSurrender = () => ticTacToeApi.surrender({ roomId });
    const tttHandleOnReady = () => ticTacToeApi.readyGame({ roomId });

    const emitTTTGet = () => clientIoTTT.emit(TTTGatewayAction.TTT_GET, { roomId });
    const emitTTTCounter = () => clientIoTTT.emit(TTTGatewayAction.TTT_COUNTER, { roomId });

    const onRestartGame = (res: ServerResponse<TicTacToeBoard>) => router.push(`${routers.ticTacToePvP.link}/${res.data.id}`);
    const onTTTGet = (res: ServerResponse<TicTacToeBoard>) => {
        setTTTBoard(res.data);
        setTTTPlayers(res.data.users);
        const currentUser = res.data.users.find((item) => item.id === authState.id);
        if (currentUser) setCurrentTTTPlayer(currentUser);
    };
    const onTTTCounter = (res: ServerResponse<GamePlayer[]>) => setTTTPlayers(res.data);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (tttBoard.status === GameStatus.PLAYING) interval = setInterval(() => emitTTTCounter(), 1000);

        if (tttBoard && tttBoard.status === GameStatus.END) {
            const sound = new Audio('/asset/sounds/end-game.mp3');
            sound.volume = 0.5;
            sound.play();
        }
        return () => clearInterval(interval);
    }, [tttBoard.status, roomId]);

    React.useEffect(() => {
        if (roomId && authState.isSocketLogin)
            ticTacToeApi
                .joinRoom({ roomId })
                .then(() => clientIoTTT.emit(TTTGatewayAction.TTT_JOIN, { roomId }))
                .catch(() => router.push(routers[404].link));
    }, [authState.isSocketLogin, roomId]);

    React.useEffect(() => {
        clientIoTTT.on(TTTGatewayAction.TTT_GET, onTTTGet);
        clientIoTTT.on(TTTGatewayAction.TTT_JOIN, emitTTTGet);
        clientIoTTT.on(TTTGatewayAction.TTT_RESTART, onRestartGame);
        clientIoTTT.on(TTTGatewayAction.TTT_COUNTER, onTTTCounter);

        return () => {
            clientIoTTT.off(TTTGatewayAction.TTT_COUNTER, onTTTCounter);
            clientIoTTT.off(TTTGatewayAction.TTT_RESTART, onRestartGame);
            clientIoTTT.off(TTTGatewayAction.TTT_GET, onTTTGet);
            clientIoTTT.off(TTTGatewayAction.TTT_JOIN, emitTTTGet);
        };
    }, [roomId, authState]);

    React.useEffect(() => {
        return () => {
            ticTacToeApi.leaveGame({ roomId });
        };
    }, [roomId]);

    return {
        tttBoard,
        tttPlayers,
        currentTTTPlayer,
        tttBoardRef,
        tttHandleOnReady,
        tttHandleOnStart,
        tttHandleOnAddMove,
        tttHandleOnRestart,
        tttHandleOnSurrender,
        tttHandleOnCreateDraw,
        tttHandleOnAcceptDraw,
    };
}

export default useGameTTT;
