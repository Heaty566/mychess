import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
      constructor() {
            super({
                  clientID: process.env.GITHUB_CLIENT_ID,
                  clientSecret: process.env.GITHUB_SECRET,
                  callbackURL: 'http://localhost:4000/api/auth/github/callback',
            });
      }

      validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
            try {
                  const user = new User();
                  console.log(profile);
                  done(null, user);
            } catch (err) {
                  console.log(err);
                  done(err, null);
            }
      }
}
