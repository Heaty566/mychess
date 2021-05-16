import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import { PlayerFlagEnum } from './chess.interface';
import { ChessMove } from './chessMove.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Chess {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @ManyToMany(() => User, { onUpdate: 'CASCADE' })
      @JoinTable()
      users: User[];

      @Column({ default: -1 })
      winner: PlayerFlagEnum;

      @Column({ default: 0 })
      changeOne: number;

      @Column({ default: 0 })
      changeTwo: number;

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
