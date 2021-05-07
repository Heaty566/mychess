import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

//---- Entity
import User from '../../users/entities/user.entity';
import { Message } from './message.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Chat {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @OneToMany(() => Message, (message) => message.chat)
      messages: Message[];

      @ManyToMany(() => User)
      @JoinTable()
      users: User[];

      constructor() {
            this.createDate = new Date();
            // this.id = uuidv4();
      }
}
