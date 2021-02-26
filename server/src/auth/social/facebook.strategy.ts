import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
      constructor() {
            super({
                  clientID: process.env.FACEBOOK_CLIENT_ID,
                  clientSecret: process.env.FACEBOOK_SECRET,
                  callbackURL: 'http://localhost:4000/api/auth/facebook/callback',
                  scope: ['email'],
            });
      }
      validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
            try {
                  const user = new User();
                  user.facebookId = profile.id;
                  user.name = profile.displayName;
                  done(null, user);
            } catch (err) {
                  done(err, null);
            }
      }
}
