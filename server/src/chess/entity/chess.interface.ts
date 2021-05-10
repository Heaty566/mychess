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

export interface ChessMoveCache {
      x: number;
      y: number;
      chessRole: ChessRole;
      flag: PlayerFlagEnum;
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

export interface ChessPlayer {
      id: string;
      flag: PlayerFlagEnum.WHITE | PlayerFlagEnum.BLACK;
      time: number;
      ready: boolean;
      username: string;
      elo: number;
      avatarUrl: string;
      name: string;
}
