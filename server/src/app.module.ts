import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { RepositoryModule } from './repository/repository.module';

@Module({
      imports: [
            AuthModule,
            UserModule,
            TypeOrmModule.forRoot({
                  url: 'mongodb://127.0.0.1:27017/mydatabase',
                  type: 'mongodb',
                  synchronize: true,
                  keepConnectionAlive: true,
                  useUnifiedTopology: true,
                  entities: [User],
            }),
            RepositoryModule,
      ],
      controllers: [AppController],
      providers: [AppService],
})
export class AppModule {}
