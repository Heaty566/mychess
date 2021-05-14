export enum ChessRole {
      KING = 1,
      QUEEN = 2,
      ROOK = 3,
      KNIGHT = 4,
      BISHOP = 5,
      PAWN = 6,
      EMPTY = -1,
}

export interface ChessFlag {
      chessRole: ChessRole;
      flag: PlayerFlagEnum;
}

export interface ChessMove {
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      chessRole: ChessRole;
      flag: PlayerFlagEnum;
}
export interface ChessMoveRedis {
      x: number;
      y: number;
      chessRole: ChessRole;
      flag: PlayerFlagEnum;
}

export interface ChessMoveCoordinates {
      x: number;
      y: number;
}

export enum PlayerFlagEnum {
      WHITE = 0,
      BLACK = 1,
      EMPTY = -1,
}

export enum ChessStatus {
      'NOT_YET' = 0,
      'PLAYING' = 1,
      'END' = 2,
      'DRAW' = 3,
}

export interface ChessPlayer {
      id: string;
      flag: PlayerFlagEnum.WHITE | PlayerFlagEnum.BLACK;
      time: number;
      ready: boolean;
      username: string;
      elo: number;
      avatarUrl: string;
      name: string;
      isDraw: boolean;
}

export interface EloCalculator {
      whiteElo: number;
      blackElo: number;
}

export enum StandardPieceValue {
      KING = 10000,
      QUEEN = 1000,
      ROOK = 525,
      KNIGHT = 350,
      BISHOP = 350,
      PAWN = 100,
}
