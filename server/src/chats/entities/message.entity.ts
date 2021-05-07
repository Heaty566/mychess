import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import { Chat } from './chat.entity';

@Entity()
export class Message {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      content: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @ManyToOne(() => Chat, (chat) => chat.messages)
      chat: Chat;

      @Column()
      userId: string;

      constructor(userId: string, content: string) {
            this.createDate = new Date();
            this.userId = userId;
            this.content = content;
      }
}
