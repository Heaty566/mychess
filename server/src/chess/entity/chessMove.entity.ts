import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import { Chess } from './chess.entity';
import { ChessRole, PlayerFlagEnum } from './chess.interface';

@Entity()
export class ChessMove {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      fromX: number;

      @Column()
      fromY: number;

      @Column()
      toX: number;

      @Column()
      toY: number;

      @Column()
      chessRole: ChessRole;

      @Column()
      flag: PlayerFlagEnum;

      @ManyToOne(() => Chess, (chess) => chess.moves, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      chess: Chess;
}
