import { MiddlewareConsumer, Module } from '@nestjs/common';

import { LoggerMiddleware } from './global/logger.middleware';
import { PrismaService } from './global/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [PrismaService, UsersService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
