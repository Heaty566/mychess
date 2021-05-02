import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';

@Entity()
export class Chess {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @ManyToOne(() => User, (user) => user.whiteChesses)
      whiteUser: User;

      @ManyToOne(() => User, (user) => user.blackChesses)
      blackUser: User;

      @Column()
      winner: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      startDate: Date;

      @Column({ default: null })
      endDate: Date;
}
