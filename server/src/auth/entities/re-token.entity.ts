import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReToken {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      data: string;

      @Column()
      userId: ObjectId;
}
