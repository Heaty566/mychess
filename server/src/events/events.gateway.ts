import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Server } from 'socket.io';

@WebSocketGateway(8000)
export class EventsGateway {
      constructor(private readonly eventsService: EventsService) {}

      @WebSocketServer()
      server: Server;

      @SubscribeMessage('userInputFromClient')
      createRoom(@MessageBody() data: string) {
            this.server.emit('userInputFromServer', data);
      }
}
