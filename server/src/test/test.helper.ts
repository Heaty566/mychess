import * as io from 'socket.io-client';

//* where magic come from
export function defuse(promise) {
      promise.catch(() => {
            //
      });
      return promise;
}

export async function getIoClient(port: number, namespace: string, token: string) {
      return await io(`http://localhost:${port}/${namespace}`, {
            autoConnect: false,
            transportOptions: {
                  polling: {
                        extraHeaders: {
                              Cookie: `io-token=${token};`,
                        },
                  },
            },
      });
}

export const generateCookie = (reToken: string) => [`re-token=${reToken} ;`];
interface FakeDataType {
      lettersAndNumbers: string;
      lettersAndNumbersLowerCase: string;
      lettersLowerCase: string;
      letters: string;
      number: string;
}

const fakePattern: FakeDataType = {
      lettersAndNumbers: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      lettersAndNumbersLowerCase: 'abcdefghijklmnopqrstuvwxyz0123456789',
      lettersLowerCase: 'abcdefghijklmnopqrstuvwxyz',
      letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      number: '0123456789',
};

export function fakeData(length: number, type: keyof FakeDataType = 'lettersAndNumbers') {
      let result = '';
      const characters = fakePattern[type];
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
}
