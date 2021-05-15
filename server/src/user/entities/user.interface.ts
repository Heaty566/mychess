export interface UserSocketGame {
      tttId: string;
      chessId: string;
}

export interface UserSocket {
      id: string;
      username: string;
      games: UserSocketGame;
}
