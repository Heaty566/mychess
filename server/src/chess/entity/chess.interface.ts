import { Piece } from './chess.piece';

export interface Square {
      x: number;
      y: number;
      piece?: Piece;
}
