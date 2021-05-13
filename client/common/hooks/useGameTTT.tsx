import { useRouter } from 'next/router';
import * as React from 'react';
import { useSelector } from 'react-redux';
import ticTacToeApi from '../../api/tttApi';
import { RootState } from '../../store';
import { ServerResponse } from '../interface/api.interface';
import { TicTacToeBoard, TTTGatewayAction } from '../interface/tic-tac-toe.interface';
import { AuthState } from '../interface/user.interface';
import useSocketIo from './useSocketIo';
import routers from '../constants/router';
import { GamePlayer, GameStatus } from '../interface/game.interface';

export function useGameTTT(roomId: string) {
    const clientIoTTT = useSocketIo({ namespace: 'tic-tac-toe' });
    const router = useRouter();
    const chessBoardRef = React.useRef<HTMLDivElement>(null);
    const [tttBoard, setTTTBoard] = React.useState<TicTacToeBoard>();
    const [players, setPlayers] = React.useState<GamePlayer[]>([]);
    const authState = useSelector<RootState, AuthState>((state) => state.auth);

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
            .catch(() => router.push(routers[404].link));
    };

    const handleOnAddMove = (x: number, y: number) => {
        const sound = new Audio('/asset/sounds/ttt-click.mp3');
        sound.volume = 0.5;
        sound.play();
        ticTacToeApi.addMovePvP({ roomId, x, y });
    };
    const handleOnReady = () => {
        ticTacToeApi.readyGame({ roomId });
    };

    const emitTTTGet = () => clientIoTTT.emit(TTTGatewayAction.TTT_GET, { roomId });
    const emitTTTCounter = () => clientIoTTT.emit(TTTGatewayAction.TTT_COUNTER, { roomId });

    const onRestartGame = (res: ServerResponse<TicTacToeBoard>) => router.push(`${routers.ticTacToePvP.link}/${res.data.id}`);
    const onTTTGet = (res: ServerResponse<TicTacToeBoard>) => setTTTBoard(res.data);
    const onTTTCounter = (res: ServerResponse<GamePlayer[]>) => setPlayers(res.data);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;

        if (tttBoard?.status === GameStatus.PLAYING) interval = setInterval(() => emitTTTCounter(), 1000);

        return () => clearInterval(interval);
    }, [tttBoard?.status, roomId]);

    React.useEffect(() => {
        if (tttBoard && tttBoard.status === GameStatus.END) {
            const sound = new Audio('/asset/sounds/end-game.mp3');
            sound.volume = 0.5;
            sound.play();
        }
    }, [tttBoard?.status]);

    React.useEffect(() => {
        if (roomId && authState.isSocketLogin)
            ticTacToeApi
                .joinRoom({ roomId })
                .then(() => clientIoTTT.emit(TTTGatewayAction.TTT_JOIN, { roomId }))
                .catch(() => router.push(routers[404].link));
    }, [authState.isSocketLogin, roomId]);

    React.useEffect(() => {
        return () => {
            ticTacToeApi.leaveGame({ roomId });
        };
    }, [roomId]);

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
    }, [roomId]);

    return { tttBoard, players, chessBoardRef, handleOnReady, handleOnStart, handleOnAddMove, handleOnRestart };
}

export default useGameTTT;
