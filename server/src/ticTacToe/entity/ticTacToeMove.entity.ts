import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TicTacToeFlag } from './ticTacToe.interface';
import { TicTacToe } from './ticTacToe.entity';

@Entity()
export class TicTacToeMove {
      @PrimaryGeneratedColumn('uuid')
      id: string;
      @Column()
      x: number;

      @Column()
      y: number;

      @Column()
      flag: TicTacToeFlag;

      @ManyToOne(() => TicTacToe, (ticTacToe) => ticTacToe.moves, { onDelete: 'CASCADE' })
      ticTacToe: TicTacToe;
}
