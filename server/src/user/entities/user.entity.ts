import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

//---- Entity
import { Notification } from '../../notifications/entities/notification.entity';
import { UserRole } from './user.userRole.enum';

@Entity()
export class User {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: null })
      username: string;

      @Column({ default: null })
      password: string;

      @Column({ nullable: false })
      name: string;

      @Column({ default: 'https://my-quiz-v2.s3-ap-southeast-1.amazonaws.com/system/share/default-avatar.jpg' })
      avatarUrl: string;

      @Column({ default: null, unique: true })
      googleId: string;

      @Column({ default: null, unique: true })
      facebookId: string;

      @Column({ default: null, unique: true })
      githubId: string;

      @Column({ default: 1200 })
      elo: number;

      @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
      createDate: Date;

      @Column({ default: UserRole.USER.toString() })
      role: UserRole;

      @Column({ default: false })
      isDisabled: boolean;

      @Column({ default: null })
      email: string;

      @Column({ default: null })
      phoneNumber: string;

      @OneToMany(() => Notification, (notification) => notification.receiver, { cascade: true })
      notifications: Notification[];
}

export default User;
