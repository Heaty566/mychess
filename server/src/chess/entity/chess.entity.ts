import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';
import { ChessStatus } from './chess.interface';

@Entity()
export class Chess {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: ChessStatus['NOT-YET'] })
      status: ChessStatus;

      @ManyToMany(() => User)
      @JoinTable()
      users: User[];

      @Column({ default: null })
      whiteUser: string;

      @Column({ default: null })
      blackUser: string;

      @Column()
      winner: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      startDate: Date;

      @Column({ default: null })
      endDate: Date;
}
