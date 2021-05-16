import { UserRole } from '../user/entities/user.userRole.enum';
import { User } from '../user/entities/user.entity';
import { fakeData } from './test.helper';

export const fakeUser = () => {
      const user = new User();
      user.name = fakeData(10, 'lettersLowerCase');
      user.username = fakeData(10, 'lettersAndNumbersLowerCase');
      user.password = '123abcAbc';
      user.googleId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.facebookId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.githubId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.role = UserRole.USER;
      user.phoneNumber = `+8498${fakeData(7, 'number')}`;
      user.email = `${fakeData(10, 'letters')}@gmail.com`;

      return user;
};
