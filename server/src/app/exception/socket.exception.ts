import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class SocketExceptionsFilter extends BaseWsExceptionFilter {
      catch(exception: unknown, host: ArgumentsHost) {
            const client = host.switchToWs().getClient();

            this.handleError(client, exception);
      }

      handleError(client: any, exception: any) {
            client.emit('exception', exception.error);
      }
}
