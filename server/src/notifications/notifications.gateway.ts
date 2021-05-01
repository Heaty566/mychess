import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { SocketExtend, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';

//---- Service
import { UserService } from '../users/user.service';
import { NotificationsService } from './notifications.service';

//---- Entity
import { Notification } from './entities/notification.entity';
import { NotificationConnectType } from './entities/notificationConnectType.entity';

//---- Pipe
import { UserSocketGuard } from '../auth/authSocket.guard';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- DTO
import { SendNotificationDto, vSendNotificationDto } from './dto/sendNotificationDto';

//---- ENum
import { NotificationAction } from './notifications.action';
import { NotificationType } from './entities/notification.type.enum';
import { NotificationContent } from './entities/notification.content.enum';
import { NotificationAddFriendType } from './entities/notificationAddFriendType.entity';

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
      async sendRequest(
            @ConnectedSocket() client: SocketExtend,
            @MessageBody(new JoiValidatorPipe(vSendNotificationDto)) data: SendNotificationDto,
      ): Promise<WsResponse<any>> {
            const receiverUser = await this.userService.findOneUserByField('id', data.receiver);

            if (receiverUser) {
                  const newNotification = new Notification(data.notificationType);
                  let notificationObjectType;

                  switch (data.notificationType) {
                        case NotificationType.CONNECT:
                              notificationObjectType = new NotificationConnectType(NotificationContent.CONNECT_CONTENT, data.link, data.sender);

                        case NotificationType.ADD_FRIEND:
                              notificationObjectType = new NotificationAddFriendType(NotificationContent.ADD_FRIEND_CONTENT, data.sender);
                  }

                  newNotification.objectTypeId = notificationObjectType.id;

                  receiverUser.notifications = [newNotification];
                  await this.userService.saveUser(receiverUser);
                  await this.notificationsService.saveNotification(notificationObjectType);

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
