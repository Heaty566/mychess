import { ChessRole } from '../chess.interface';

export interface ChessChooseAPieceDTO {
    roomId: string;
    x: number;
    y: number;
}
export interface DrawDTO {
    roomId: string;
    isAccept: boolean;
}

export interface PromoteChessDto {
    promotePos: { x: number; y: number };
    roomId: string;
    promoteRole: ChessRole;
}

export interface AddMoveChess {
    roomId: string;
    curPos: { x: number; y: number };
    desPos: { x: number; y: number };
}

export type PromoteChessRole = ChessRole.KNIGHT | ChessRole.QUEEN | ChessRole.ROOK | ChessRole.BISHOP;
