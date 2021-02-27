declare namespace Express {
      export interface Request {
            user?: import('./src/user/entities/user.entity').User;
      }
}
