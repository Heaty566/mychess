import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class ReToken {
      @ObjectIdColumn()
      _id: ObjectId;

      @Column()
      data: string;

      @Column()
      userId: ObjectId;
}
