import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chess } from './chess.entity';
import { ChessRole, PlayerFlagEnum } from './chess.interface';

@Entity()
export class ChessMove {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      x: number;

      @Column()
      y: number;

      @Column()
      chessRole: ChessRole;

      @Column()
      flag: PlayerFlagEnum;

      @ManyToOne(() => Chess, (chess) => chess.moves, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      chess: Chess;
}
