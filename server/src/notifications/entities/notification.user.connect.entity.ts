import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class NotificationUserConnect {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      link: string;

      @Column()
      content: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createdTime: Date;

      @OneToOne(() => User)
      @JoinColumn()
      senderId: User;
}
