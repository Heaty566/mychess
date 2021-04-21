import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Chat {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @OneToMany(() => Message, (message) => message.chat)
      messages: Message[];
}
