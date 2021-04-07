import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(80, { namespace: 'events' })
export class EventsGateWay {
      @SubscribeMessage('events')
      getData(@MessageBody() data: string) {
            return data;
      }
}
