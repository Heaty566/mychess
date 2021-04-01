import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
      constructor(private authService: AuthService, private userService: UserService) {
            super({
                  clientID: process.env.GITHUB_CLIENT_ID,
                  clientSecret: process.env.GITHUB_SECRET,
                  callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
                  scope: ['email', 'profile'],
            });
      }

      async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
            try {
                  let user = await this.userService.findOneUserByField('githubId', profile.id);
                  if (!user) {
                        user = new User();
                        user.githubId = profile.id;
                        user.name = profile.displayName;
                        user.avatarUrl = profile.photos[0].value; // avatar??
                        user = await this.authService.saveUser(user);
                  }
                  done(null, user);
            } catch (err) {
                  done(err, null);
            }
      }
}
