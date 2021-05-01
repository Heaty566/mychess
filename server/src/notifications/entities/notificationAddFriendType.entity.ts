import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';

@Entity()
export class NotificationAddFriendType {
      constructor(content: string, sender: string) {
            this.content = content;
            this.sender = sender;
      }

      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @Column({ default: null })
      content: string;

      @Column({ default: null })
      sender: string;
}
