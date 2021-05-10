import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';

//---- Entity
import User from '../../user/entities/user.entity';
import { ChessStatus, PlayerFlagEnum } from './chess.interface';
import { ChessMove } from './chessMove.entity';

@Entity()
export class Chess {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @ManyToMany(() => User, { onUpdate: 'CASCADE' })
      @JoinTable()
      users: User[];

      @Column({ default: null })
      whiteUser: string;

      @Column({ default: null })
      blackUser: string;

      @Column({ default: -1 })
      winner: PlayerFlagEnum;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      startDate: Date;

      @Column({ default: null })
      endDate: Date;

      @OneToMany(() => ChessMove, (move) => move.chess)
      moves: ChessMove[];

      @Column({ default: null })
      chatId: string;

      constructor() {
            this.startDate = new Date();
            this.winner = PlayerFlagEnum.EMPTY;
      }
}
