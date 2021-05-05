export enum ChessRole {
      KING = 1,
      QUEEN = 2,
      ROOK = 3,
      KNIGHT = 4,
      BISHOP = 5,
      PAWN = 6,
}

export type PlayerFlag = -1 | 0 | 1;

export interface ChessFlag {
      chess: ChessRole | -1;
      flag: PlayerFlag;
}

export interface ChessMove {
      x: number;
      y: number;
      chessRole: ChessRole;
      flag: PlayerFlag;
}

export interface AvaibleMove {
      x: number;
      y: number;
}

export enum PlayerFlagEnum {
      WHITE = 0,
      BLACK = 1,
      EMPTY = -1,
}

export enum ChessStatus {
      'NOT_YET' = '-1',
      'END' = '0',
      'PLAYING' = '1',
}