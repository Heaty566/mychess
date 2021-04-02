import { UserRole } from '../src/models/users/entities/user.userRole.enum';
import { User } from '../src/models/users/entities/user.entity';
import { fakeData } from './fakeData';

export const fakeUser = () => {
      const user = new User();
      user.name = fakeData(10, 'lettersLowerCase');
      user.username = fakeData(10, 'lettersAndNumbersLowerCase');
      user.password = '123abcAbc';
      user.googleId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.facebookId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.githubId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.role = UserRole.USER;

      return user;
};
