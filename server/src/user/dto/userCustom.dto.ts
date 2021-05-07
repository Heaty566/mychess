import { User } from '../entities/user.entity';

export class UserCustomDTO {
      constructor(user: User) {
            this.id = user.id;
            this.username = user.username;
            this.name = user.name;
            this.avatarUrl = user.avatarUrl;
            this.elo = user.elo;
            this.createDate = user.createDate;
            this.email = user.email;
            this.phoneNumber = user.phoneNumber;
      }

      id: string;

      username: string;

      name: string;

      avatarUrl: string;

      elo: number;

      createDate: Date;

      email: string;

      phoneNumber: string;
}
