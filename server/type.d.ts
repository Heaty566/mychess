import UserExtend from './src/users/entities/user.entity';

declare global {
      namespace Express {
            interface User extends UserExtend {}
      }
}

declare module 'socket.io' {
      export class Socket {
            user?: UserExtend;
            cookies: Record<string, string>;
      }
}
