import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

//---------Module
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { TicTacToeModule } from './ticTacToe/ticTacToe.module';
import { ChessModule } from './chess/chess.module';

//---------Provider
import { SmailModule } from './providers/smail/smail.module';
import { SmsModule } from './providers/sms/sms.module';
import { AwsModule } from './providers/aws/aws.module';
import { NotificationsModule } from './notifications/notifications.module';

//---------Utils
import { LoggerModule } from './utils/logger/logger.module';
import { RedisModule } from './providers/redis/redis.module';
import { RepositoryModule } from './utils/repository/repository.module';

//---------Entity
import { User } from './users/entities/user.entity';
import { ReToken } from './auth/entities/re-token.entity';
import { Notification } from './notifications/entities/notification.entity';
import { ChatsModule } from './chats/chats.module';
import { Chat } from './chats/entities/chat.entity';
import { Message } from './chats/entities/message.entity';
import { TicTacToe } from './ticTacToe/entity/ticTacToe.entity';
import { TicTacToeMove } from './ticTacToe/entity/ticTacToeMove.entity';
import { Chess } from './chess/entity/chess.entity';
import { ChessMove } from './chess/entity/chessMove.entity';

const Config = ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.env.${process.env.NODE_ENV}`,
});

const DBConfig = TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      keepConnectionAlive: true,
      entities: [User, ReToken, Notification, Chat, Message, TicTacToe, TicTacToeMove, Chess, ChessMove],
      extra: { connectionLimit: 5 },
});

@Module({
      imports: [
            // --- Config
            Config,
            DBConfig,
            ScheduleModule.forRoot(),

            // --- Module
            AuthModule,
            UserModule,
            CommonModule,
            NotificationsModule,
            TicTacToeModule,
            ChessModule,

            // --- Provider
            SmailModule,
            SmsModule,
            AwsModule,

            // --- Utils
            LoggerModule,
            RedisModule,
            RepositoryModule,
            ChatsModule,
            ChessModule,
      ],
      controllers: [],
})
export class AppModule {}
