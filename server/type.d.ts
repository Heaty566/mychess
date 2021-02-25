import { User } from './src/user/entities/user.entity';

declare global {
      namespace Express {
            export interface Request {
                  user?: User;
            }
      }
}
