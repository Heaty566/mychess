import UserExtend from './src/models/users/entities/user.entity';

declare global {
      namespace Express {
            interface User extends UserExtend {}
      }
}
