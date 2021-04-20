import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;
}
