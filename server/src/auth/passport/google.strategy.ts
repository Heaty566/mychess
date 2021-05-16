import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

//---- Service
import { UserService } from '../../user/user.service';

//---- Entity
import { User } from '../../user/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
      constructor(private userService: UserService) {
            super({
                  clientID: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_SECRET,
                  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
                  scope: ['email', 'profile'],
            });
      }

      async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
            try {
                  let user = await this.userService.findOneUserByField('googleId', profile.id);
                  if (!user) {
                        user = new User();
                        user.googleId = profile.id;
                        user.name = profile.displayName;
                        user.avatarUrl = profile.photos[0].value;
                        user.email = profile._json.email;
                        user = await this.userService.saveUser(user);
                  }
                  done(null, user);
            } catch (err) {
                  done(err, null);
            }
      }
}
