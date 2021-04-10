import { Chat } from '../../../chats/entities/chat.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      text: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      sentTime: Date;

      @ManyToOne(() => Chat, (chat) => chat.messages)
      chat: Chat;
}
