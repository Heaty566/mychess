import { useRouter } from 'next/router';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { chessApi } from '../../api/chessApi';
import { RootState } from '../../store';
import { ServerResponse } from '../interface/api.interface';
import { ChessGatewayAction, ChessBoard, ChessMoveRedis, ChessRole } from '../interface/chess.interface';
import { AuthState } from '../interface/user.interface';
import useSocketIo from './useSocketIo';
import routers from '../constants/router';
import { PromoteChessRole } from '../interface/dto/chess.dto';
import { GamePlayer, GamePlayerFlag, GameStatus } from '../interface/game.interface';

const playerDefault: GamePlayer = {
    avatarUrl: '',
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

const chessBoardDefault: ChessBoard = {
    board: [],
    chatId: '',
    id: '',
    isBotMode: false,
    moves: [],
    startDate: new Date(),
    status: GameStatus.NOT_YET,
    turn: false,
    users: [playerDefault, playerDefault],
    winner: GamePlayerFlag.EMPTY,
};

const chessMoveRedisDefault: ChessMoveRedis = {
    chessRole: ChessRole.EMPTY,
    flag: GamePlayerFlag.EMPTY,
    x: 0,
    y: 0,
};

const players: Array<GamePlayer> = [playerDefault, playerDefault];

export function useGameChess(roomId: string) {
    const authState = useSelector<RootState, AuthState>((state) => state.auth);
    const clientIoChess = useSocketIo({ namespace: 'chess' });
    const router = useRouter();
    const chessBoardRef = React.useRef<HTMLDivElement>(null);
    const [chessBoard, setChessBoard] = React.useState<ChessBoard>(chessBoardDefault);
    const [chessPlayers, setChessPlayers] = React.useState<GamePlayer[]>(players);
    const [chessSuggestion, setChessSuggestion] = React.useState<ChessMoveRedis[]>([]);
    const [currentChessSelect, setCurrentChessSelect] = React.useState<ChessMoveRedis>(chessMoveRedisDefault);
    const [currentChessPlayer, setCurrentChessPlayer] = React.useState<GamePlayer>(playerDefault);
    const [isChessPromote, setChessPromote] = React.useState<boolean>(false);

    const chessHandleOnRestart = () => {
        if (chessBoard.isBotMode)
            chessApi.createNewBotRoom().then((res) => {
                const roomId = res.data.data.roomId;
                router.push(`${routers.ticTacToePvP.link}/${roomId}`);
            });
        else chessApi.restartGame({ roomId });
    };
    const chessHandleOnStart = () =>
        chessApi
            .startGame({ roomId })
            .then(() => {
                if (chessBoardRef.current) {
                    const clientWidth = chessBoardRef.current.clientWidth / 2;
                    const scrollCenter = chessBoardRef.current.scrollWidth / 2 - clientWidth;
                    chessBoardRef.current.scrollLeft = scrollCenter;
                }
            })
            .catch(() => router.push(routers[404].link));

    const chessHandleOnReady = () => chessApi.readyGame({ roomId });
    const chessHandleOnDraw = () => chessApi.drawGameCreate({ roomId });
    const chessHandleOnAcceptDraw = (isDraw: boolean) => chessApi.drawGameAccept({ roomId, isAccept: isDraw });
    const chessHandleOnSurrender = () => chessApi.surrender({ roomId });
    const chessHandleOnPromote = (role: PromoteChessRole) => {
        if (currentChessSelect && isChessPromote)
            chessApi.promoteChess({ promotePos: { x: currentChessSelect?.x, y: currentChessSelect?.y }, promoteRole: role, roomId }).then(() => {
                setChessPromote(false);
            });
    };

    const chessHandleOnClick = (x: number, y: number) => {
        if (chessBoard.board[x][y].flag === currentChessPlayer.flag) {
            setCurrentChessSelect({
                chessRole: chessBoard.board[x][y].chessRole,
                flag: chessBoard.board[x][y].flag,
                x,
                y,
            });
            chessApi
                .getSuggestion({ roomId, x, y })
                .then((res) => setChessSuggestion(res.data.data))
                .catch(() => setChessSuggestion([]));
        } else {
            const findMove = chessSuggestion.find((item) => item.x === x && item.y === y);

            if (findMove) {
                setCurrentChessSelect({
                    chessRole: chessBoard.board[x][y].chessRole,
                    flag: chessBoard.board[x][y].flag,
                    x,
                    y,
                });

                chessApi.addMovePvP({ roomId, curPos: { x: currentChessSelect.x, y: currentChessSelect.y }, desPos: { x, y } }).then(() => {
                    const sound = new Audio('/asset/sounds/ttt-click.mp3');
                    sound.volume = 0.5;
                    sound.play();
                    setChessSuggestion([]);
                });
            }
        }
    };

    const emitChessGet = () => clientIoChess.emit(ChessGatewayAction.CHESS_GET, { roomId });
    const emitChessCounter = () => clientIoChess.emit(ChessGatewayAction.CHESS_COUNTER, { roomId });

    const onRestartGame = (res: ServerResponse<ChessBoard>) => router.push(`${routers.chessPvP.link}/${res.data.id}`);
    const onChessGet = (res: ServerResponse<ChessBoard>) => {
        setChessBoard(res.data);
        setChessPlayers(res.data.users);

        const currentUser = res.data.users.find((item) => item.id === authState.id);
        if (currentUser) setCurrentChessPlayer(currentUser);
    };
    const onChessCounter = (res: ServerResponse<GamePlayer[]>) => setChessPlayers(res.data);
    const onPromote = (res: { data: { userId: string } }) => {
        const user = authState.id === res.data.userId;

        if (user) setChessPromote(true);
    };

    console.log(currentChessPlayer);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (chessBoard && chessBoard.status === GameStatus.END) {
            const sound = new Audio('/asset/sounds/end-game.mp3');
            sound.volume = 0.5;
            sound.play();
        }
        if (chessBoard?.status === GameStatus.PLAYING) interval = setInterval(() => emitChessCounter(), 1000);
        return () => {
            clearInterval(interval);
        };
    }, [chessBoard.status, roomId]);

    React.useEffect(() => {
        if (roomId && authState.isSocketLogin)
            chessApi
                .joinRoom({ roomId })
                .then(() => clientIoChess.emit(ChessGatewayAction.CHESS_JOIN, { roomId }))
                .catch(() => router.push(routers[404].link));
    }, [authState.isSocketLogin, roomId]);

    React.useEffect(() => {
        clientIoChess.on(ChessGatewayAction.CHESS_GET, onChessGet);
        clientIoChess.on(ChessGatewayAction.CHESS_JOIN, emitChessGet);
        clientIoChess.on(ChessGatewayAction.CHESS_COUNTER, onChessCounter);
        clientIoChess.on(ChessGatewayAction.CHESS_RESTART, onRestartGame);
        clientIoChess.on(ChessGatewayAction.CHESS_PROMOTE_PAWN, onPromote);

        return () => {
            clientIoChess.off(ChessGatewayAction.CHESS_PROMOTE_PAWN, onPromote);
            clientIoChess.off(ChessGatewayAction.CHESS_RESTART, onRestartGame);
            clientIoChess.off(ChessGatewayAction.CHESS_COUNTER, onChessCounter);
            clientIoChess.off(ChessGatewayAction.CHESS_GET, onChessGet);
            clientIoChess.off(ChessGatewayAction.CHESS_JOIN, emitChessGet);
        };
    }, [roomId, authState]);

    React.useEffect(() => {
        return () => {
            chessApi.leaveGame({ roomId });
        };
    }, [roomId]);

    return {
        chessBoard,
        chessPlayers,
        currentChessPlayer,
        chessSuggestion,
        chessBoardRef,
        isChessPromote,
        //-------------
        chessHandleOnClick,
        chessHandleOnReady,
        chessHandleOnStart,
        chessHandleOnDraw,
        chessHandleOnAcceptDraw,
        chessHandleOnRestart,
        chessHandleOnPromote,
        chessHandleOnSurrender,
    };
}

export default useGameChess;
