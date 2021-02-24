//* Internal import
import { User } from '../src/user/entities/user.entity';
import { fakeData } from './fakeData';
import { AuthToken } from '../src/auth/entities/authToken.entity';

export const fakeUser = () => {
      const user = new User();
      user.name = fakeData(10, 'lettersLowerCase');
      user.username = fakeData(10, 'lettersAndNumbersLowerCase');
      user.password = fakeData(10, 'lettersAndNumbersLowerCase');
      user.googleId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.facebookId = fakeData(10, 'lettersAndNumbersLowerCase');
      user.githubId = fakeData(10, 'lettersAndNumbersLowerCase');

      return user;
};

export const fakeAuthToken = () => {
      const authToken = new AuthToken();
      authToken.data = fakeData(10, 'lettersAndNumbers');

      return authToken;
};
