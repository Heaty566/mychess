import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import User from '../../user/entities/user.entity';

@Entity()
export class Notification {
      constructor(notificationType: string, sender: string) {
            this.notificationType = notificationType;
            this.sender = sender;
      }

      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: false })
      status: boolean;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @Column({ default: null })
      objectTypeId: string;

      @Column({ default: null })
      notificationType: string;

      @Column({ default: null })
      sender: string;

      @ManyToOne(() => User, (user) => user.notifications)
      receiver: User;
}
