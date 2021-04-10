import User from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      startTime: Date;

      @Column({ default: null })
      endTime: Date;

      @Column({ default: 10 })
      limitTime: number;

      @Column({ default: 0 })
      result: number;

      @OneToOne(() => User)
      @JoinColumn()
      user1: User;

      @OneToOne(() => User)
      @JoinColumn()
      user2: User;
}

export default Room;
