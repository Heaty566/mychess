import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';

@Entity()
export class NotificationConnectType {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @Column()
      content: string;

      @Column()
      link: string;

      @ManyToOne(() => User, (user) => user.notifications)
      sender: User;
}
