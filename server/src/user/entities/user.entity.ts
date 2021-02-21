import { ObjectId } from 'mongodb';
import { ObjectIdColumn, Column, Entity } from 'typeorm';

@Entity()
export class User {
      @ObjectIdColumn()
      _id: ObjectId;

      @Column()
      username: string;

      @Column()
      password: string;

      @Column()
      name: string;

      @Column()
      avatarUrl: string;

      @Column()
      googleId: string;

      @Column()
      facebookId: string;

      @Column()
      githubId: string;

      @Column()
      elo: number;

      @Column()
      createdTime: Date;
}
