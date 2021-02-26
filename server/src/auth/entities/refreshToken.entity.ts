import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class RefreshToken {
      @ObjectIdColumn()
      _id: ObjectId;

      @Column()
      data: any;
}
