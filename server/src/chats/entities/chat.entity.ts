import { Message } from '../../models/messages/entities/message.entity';
import Room from '../../models/rooms/entities/room.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createTime: Date;

      @OneToOne(() => Room)
      @JoinColumn()
      room: Room;

      @OneToMany(() => Message, (message) => message.chat)
      messages: Message[];
}
