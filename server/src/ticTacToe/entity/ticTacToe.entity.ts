import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';
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
      status: TicTacToeStatus;

      @Column({ default: -1 })
      winner: TicTacToeFlag;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      startDate: Date;

      @Column({ default: null })
      endDate: Date;

      @OneToMany(() => TicTacToeMove, (move) => move.ticTacToe)
      moves: TicTacToeMove[];

      constructor() {
            this.status = TicTacToeStatus['NOT-YET'];
            this.startDate = new Date();
      }
}
