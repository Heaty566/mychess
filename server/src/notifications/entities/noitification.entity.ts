import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class Notification {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      status: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createdTime: Date;

      @Column()
      notificationType: string;

      @Column()
      notificationOjectId: string;

      @OneToOne(() => User)
      @JoinColumn()
      receiverId: User;
}
