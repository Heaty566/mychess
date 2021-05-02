import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class SocketExceptionsFilter extends BaseWsExceptionFilter {
      catch(exception: unknown, host: ArgumentsHost) {
            const client = host.switchToWs().getClient();
            console.log(exception);
            this.handleError(client, exception);
      }

      handleError(client: any, exception: any) {
            client.emit('exception', exception.error);
      }
}
