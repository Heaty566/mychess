import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';

@Entity()
export class NotificationConnectType {
      constructor(content: string, link: string, sender: string) {
            this.content = content;
            this.link = link;
            this.sender = sender;
      }

      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @Column({ default: null })
      content: string;

      @Column({ default: null })
      link: string;

      @Column({ default: null })
      sender: string;
}
