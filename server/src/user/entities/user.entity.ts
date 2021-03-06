import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

import { UserRole } from './user.userRole.enum';

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
      createDate: Date;

      @Column()
      role: UserRole;

      @Column()
      isDisabled: boolean;

      @Column()
      email: string;

      @Column()
      phoneNumber: string;

      constructor() {
            this.avatarUrl = '';
            this.facebookId = '';
            this.githubId = '';
            this.googleId = '';
            this.name = '';
            this.email = '';
            this.phoneNumber = '';
            this.elo = 0;
            this.password = '';
            this.username = '';
            this.role = UserRole.USER;
            this.createDate = new Date();
            this.isDisabled = false;
      }
}

export default User;
