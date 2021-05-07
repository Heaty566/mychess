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

      @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
      chat: Chat;

      @Column()
      userId: string;

      constructor() {
            this.createDate = new Date();
      }
}
