//---- Entity
import { Chess } from './chess.entity';

export class ChessBoard {
      id: string;
      board: string;
      isBotMode: boolean;
      lastStep: Date;

      constructor(readonly info: Chess, isBotMode: boolean) {
            this.isBotMode = isBotMode;
      }
}
