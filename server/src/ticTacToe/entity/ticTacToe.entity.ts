import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import User from '../../user/entities/user.entity';
import { TicTacToeStatus } from './ticTacToe.interface';
import { TicTacToeFlag } from './ticTacToe.interface';
import { TicTacToeMove } from './ticTacToeMove.entity';

@Entity()
export class TicTacToe {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @ManyToMany(() => User, { onUpdate: 'CASCADE' })
      @JoinTable()
      users: User[];

      @Column({ default: TicTacToeStatus['NOT-YET'] })
      winner: TicTacToeFlag;

      @Column({ default: 0 })
      redElo: number;

      @Column({ default: 0 })
      blueElo: number;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      startDate: Date;

      @Column({ default: null })
      endDate: Date;

      @OneToMany(() => TicTacToeMove, (move) => move.ticTacToe)
      moves: TicTacToeMove[];

      @Column({ default: null })
      chatId: string;

      constructor() {
            this.startDate = new Date();
            this.winner = TicTacToeFlag.EMPTY;
      }
}
