import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import { TicTacToe } from './ticTacToe.entity';
import { TicTacToeFlag } from './ticTacToe.interface';

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

      @ManyToOne(() => TicTacToe, (ticTacToe) => ticTacToe.moves, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      ticTacToe: TicTacToe;
}
