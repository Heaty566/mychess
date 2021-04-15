import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { SocketExtend, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';

//---- Service
import { UserService } from '../users/user.service';
import { NotificationsService } from './notifications.service';

//---- Entity
import { Notification } from './entities/notification.entity';

//---- Pipe
import { UserSocketGuard } from '../auth/authSocket.guard';

//---- DTO
import { SendNotificationDto } from './dto/sendNotificationDto';

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway {
      constructor(private readonly notificationsService: NotificationsService, private readonly userService: UserService) {}
      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage('connection-notification')
      handleInitNotification(@ConnectedSocket() client: SocketExtend): WsResponse<null> {
            if (client.user) {
                  client.join(client.user.id);
            }

            return { event: 'connection-notification-success', data: null };
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage('send-notification')
      async sendRequest(@ConnectedSocket() client: SocketExtend, @MessageBody() data: SendNotificationDto): Promise<WsResponse<any>> {
            const receiverUser = await this.userService.findOneUserByField('id', data.userId);

            if (receiverUser) {
                  const newNotification = new Notification();
                  receiverUser.notifications = [newNotification];
                  await this.userService.saveUser(receiverUser);

                  this.server.to(receiverUser.id).emit('new-notification', {});
                  return { event: 'send-notification', data: { message: 'ok' } };
            }
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage('update-notifications')
      async getNotifications(@ConnectedSocket() client: SocketExtend): Promise<WsResponse<any>> {
            const notifications = await this.notificationsService.getNotificationByUserId(client.user.id);

            return { event: 'update-notifications-success', data: notifications };
      }
}
