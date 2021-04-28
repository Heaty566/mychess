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

//---- ENum
import { NotificationAction } from './notifications.action';

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway {
      constructor(private readonly notificationsService: NotificationsService, private readonly userService: UserService) {}
      @WebSocketServer()
      server: Server;

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(NotificationAction.NOTIFICATIONS_CONNECTION)
      handleInitNotification(@ConnectedSocket() client: SocketExtend): WsResponse<null> {
            if (client.user) {
                  client.join(client.user.id);
            }

            return { event: NotificationAction.NOTIFICATIONS_CONNECTION, data: null };
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(NotificationAction.NOTIFICATIONS_SEND)
      async sendRequest(@ConnectedSocket() client: SocketExtend, @MessageBody() data: SendNotificationDto): Promise<WsResponse<any>> {
            const receiverUser = await this.userService.findOneUserByField('id', data.userId);

            if (receiverUser) {
                  const newNotification = new Notification();
                  receiverUser.notifications = [newNotification];
                  await this.userService.saveUser(receiverUser);

                  this.server.to(receiverUser.id).emit(NotificationAction.NOTIFICATIONS_NEW, {});
                  return { event: NotificationAction.NOTIFICATIONS_SEND, data: { message: 'ok' } };
            }
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(NotificationAction.NOTIFICATIONS_REFRESH)
      async getNotifications(@ConnectedSocket() client: SocketExtend): Promise<WsResponse<any>> {
            const notifications = await this.notificationsService.getNotificationByUserId(client.user.id);

            return { event: NotificationAction.NOTIFICATIONS_REFRESH, data: notifications };
      }
}
