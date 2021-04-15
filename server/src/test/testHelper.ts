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
