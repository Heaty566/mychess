import { Square } from './chess.interface';

export abstract class Piece {
      currentSquare: Square;
      color: 'white' | 'black';
      abstract legalMoves(board: Square[][]): Square[];
      abstract canMove(board: Square[][]): boolean;
}

export class King extends Piece {
      canMove(board: Square[][]): boolean {
            throw new Error('Method not implemented.');
      }
      legalMoves(board: Square[][]): Square[] {
            throw new Error('Method not implemented.');
      }

      isChecked(board: Square[][]): boolean {
            // check bishop, queen

            // check knight

            // check rook, queen

            // check pawn

            return true;
      }
}

export class Rook extends Piece {
      canMove(board: Square[][]): boolean {
            throw new Error('Method not implemented.');
      }
      legalMoves(board: Square[][]): Square[] {
            let moves: Square[];

            // Go up
            let x = this.currentSquare.x;
            let y = this.currentSquare.y + 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  y++;
            }

            // Go down
            x = this.currentSquare.x;
            y = this.currentSquare.y - 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  y--;
            }

            // Go left
            x = this.currentSquare.x - 1;
            y = this.currentSquare.y;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x--;
            }

            // Go right
            x = this.currentSquare.x + 1;
            y = this.currentSquare.y;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x++;
            }
            return moves;
      }
}

export class Bishop extends Piece {
      canMove(board: Square[][]): boolean {
            throw new Error('Method not implemented.');
      }

      legalMoves(board: Square[][]): Square[] {
            let moves: Square[];

            // Top-Left
            let x = this.currentSquare.x - 1;
            let y = this.currentSquare.y + 1;

            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x--;
                  y++;
            }

            // Top-Right
            x = this.currentSquare.x + 1;
            y = this.currentSquare.y + 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x++;
                  y++;
            }

            // Bottom-Right
            x = this.currentSquare.x + 1;
            y = this.currentSquare.y - 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x++;
                  y--;
            }

            // Bottom-Left
            x = this.currentSquare.x - 1;
            y = this.currentSquare.y - 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x--;
                  y--;
            }
            return moves;
      }
}

export class Queen extends Piece {
      canMove(board: Square[][]): boolean {
            throw new Error('Method not implemented.');
      }
      legalMoves(board: Square[][]): Square[] {
            let moves: Square[];

            // Top-Left
            let x = this.currentSquare.x - 1;
            let y = this.currentSquare.y + 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x--;
                  y++;
            }

            // Top-Right
            x = this.currentSquare.x + 1;
            y = this.currentSquare.y + 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x++;
                  y++;
            }

            // Bottom-Right
            x = this.currentSquare.x + 1;
            y = this.currentSquare.y - 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x++;
                  y--;
            }

            // Bottom-Left
            x = this.currentSquare.x - 1;
            y = this.currentSquare.y - 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x--;
                  y--;
            }

            // Go up
            x = this.currentSquare.x;
            y = this.currentSquare.y + 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  y++;
            }

            // Go down
            x = this.currentSquare.x;
            y = this.currentSquare.y - 1;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  y--;
            }

            // Go left
            x = this.currentSquare.x - 1;
            y = this.currentSquare.y;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x--;
            }

            // Go right
            x = this.currentSquare.x + 1;
            y = this.currentSquare.y;
            while (x <= 7 && x >= 0 && y <= 7 && y >= 0) {
                  if (board[x][y].piece.color === this.color) break;

                  if (board[x][y].piece.color != this.color) {
                        moves.push(board[x][y]);
                        break;
                  }

                  moves.push(board[x][y]);
                  x++;
            }
            return moves;
      }
}

export class Knight extends Piece {
      canMove(board: Square[][]): boolean {
            throw new Error('Method not implemented.');
      }
      legalMoves(board: Square[][]): Square[] {
            let moves: Square[];
            let knightMoveX = [2, 2, -2, -2, 1, -1, 1, -1];
            let knightMoveY = [1, -1, 1, -1, 2, 2, -2, -2];
            for (let i = 0; i <= 7; i++) {
                  let x = this.currentSquare.x + knightMoveX[i];
                  let y = this.currentSquare.y + knightMoveY[i];

                  if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                        if (board[x][y].piece.color != this.color) moves.push(board[x][y]);
                  }
            }
            return moves;
      }
}
