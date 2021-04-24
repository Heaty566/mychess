import { ApiMsgItem } from './serverResponse';

export interface SocketResponse<T> {
      message?: ApiMsgItem;
      isSuccess: boolean;
      details?: Record<string, ApiMsgItem>;
      data?: T;
}
