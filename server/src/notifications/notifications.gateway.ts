import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { SocketExtend, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';

//---- Service
import { UserService } from '../user/user.service';
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
// import { NotificationAddFriendType } from './entities/notificationAddFriendType.entity';
import { ioResponse } from '../app/interface/socketResponse';

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway {
      constructor(private readonly notificationsService: NotificationsService, private readonly userService: UserService) {}
      @WebSocketServer()
      server: Server;

      private emitOtherUser(userId: string, action: string, data: any) {
            this.server.to('notifications-' + userId).emit(action, data);
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(NotificationAction.NOTIFICATIONS_CONNECTION)
      handleInitNotification(@ConnectedSocket() client: SocketExtend) {
            client.join('notifications-' + client.user.id);
            return ioResponse.send(NotificationAction.NOTIFICATIONS_CONNECTION, {});
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(NotificationAction.NOTIFICATIONS_SEND)
      async sendRequest(@ConnectedSocket() client: SocketExtend, @MessageBody(new JoiValidatorPipe(vSendNotificationDto)) data: SendNotificationDto) {
            const receiverUser = await this.userService.findOneUserByField('id', data.receiver);
            if (!receiverUser) throw ioResponse.sendError({ details: { errorMessage: { type: 'error.invalid-input' } } }, 'NotFoundException');

            const newNotification = new Notification(data.notificationType, client.user.id);
            let notificationObjectType;

            switch (data.notificationType) {
                  case NotificationType.CONNECT:
                        notificationObjectType = new NotificationConnectType(data.link, NotificationContent.CONNECT_CONTENT);
            }

            newNotification.objectTypeId = notificationObjectType.id;
            receiverUser.notifications = [newNotification];
            await this.userService.saveUser(receiverUser);
            await this.notificationsService.saveNotification(notificationObjectType);

            this.emitOtherUser(receiverUser.id, NotificationAction.NOTIFICATIONS_NEW, ioResponse.mapData({}));
            return ioResponse.send(NotificationAction.NOTIFICATIONS_SEND, {});
      }

      @UseGuards(UserSocketGuard)
      @SubscribeMessage(NotificationAction.NOTIFICATIONS_GET)
      async getNotifications(@ConnectedSocket() client: SocketExtend): Promise<WsResponse<any>> {
            const notifications = await this.notificationsService.getNotificationByUserId(client.user.id);

            return { event: NotificationAction.NOTIFICATIONS_GET, data: notifications };
      }
}
