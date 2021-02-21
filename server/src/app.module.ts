import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forRoot({
    url: "mongodb://127.0.0.1:27017/caro-project",
    type: "mongodb",
    entities: [User],
    synchronize: true,
    keepConnectionAlive: true,
    useUnifiedTopology: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
