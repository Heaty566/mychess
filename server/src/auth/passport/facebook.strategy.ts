import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

import { UserService } from '../../models/users/user.service';
import { User } from '../../models/users/entities/user.entity';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
      constructor(private userService: UserService) {
            super({
                  clientID: process.env.FACEBOOK_CLIENT_ID,
                  clientSecret: process.env.FACEBOOK_SECRET,
                  callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
                  scope: ['email', 'profile'],
            });
      }
      async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
            try {
                  let user = await this.userService.findOneUserByField('facebookId', profile.id);
                  if (!user) {
                        user = new User();
                        user.facebookId = profile.id;
                        user.name = profile.displayName;
                        user.avatarUrl = profile.photos[0].value; // avatar??
                        user = await this.userService.saveUser(user);
                  }
                  done(null, user);
            } catch (err) {
                  done(err, null);
            }
      }
}
