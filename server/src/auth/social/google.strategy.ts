import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
      constructor() {
            super({
                  clientID: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_SECRET,
                  callbackURL: 'http://localhost:4000/api/auth/google/callback',
                  scope: ['email', 'profile'],
            });
      }

      validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
            try {
                  const user = new User();
                  user.name = profile._json.name;
                  user.googleId = profile._json.sub;
                  user.avatarUrl = profile._json.picture;
                  done(null, user);
            } catch (err) {
                  done(err, null);
            }
      }
}
