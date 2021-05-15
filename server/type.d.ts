import UserExtend from './src/user/entities/user.entity';
import { UserSocket } from './src/user/entities/user.interface';
import { Socket } from 'socket.io';

declare global {
      namespace Express {
            interface User extends UserExtend {}
      }
}
declare module 'socket.io' {
      export class SocketExtend extends Socket {
            user?: UserSocket;
            cookies: Record<string, string>;
      }
}
