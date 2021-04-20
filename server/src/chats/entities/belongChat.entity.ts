import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import { User } from '../../users/entities/user.entity';
import { Chat } from './chat.entity';

@Entity()
export class BelongChat {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @OneToOne(() => User)
      @JoinColumn()
      user: User;

      @OneToOne(() => Chat)
      @JoinColumn()
      chat: Chat;
}
