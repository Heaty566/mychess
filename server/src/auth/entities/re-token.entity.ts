import { ObjectId } from 'mongodb';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReToken {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      data: string;

      @Column()
      userId: string;
}
