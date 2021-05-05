import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';
import { ChessStatus, PlayerFlag } from './chess.interface';

@Entity()
export class Chess {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: ChessStatus.NOT_YET })
      status: ChessStatus;

      @ManyToMany(() => User, { onUpdate: 'CASCADE' })
      @JoinTable()
      users: User[];

      @Column({ default: null })
      whiteUser: string;

      @Column({ default: null })
      blackUser: string;

      @Column({ default: -1 })
      winner: PlayerFlag;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      startDate: Date;

      @Column({ default: null })
      endDate: Date;
}
