import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { DatabaseModule } from './database/database.module';
import { UsersResolver } from './users/users.resolver';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DocumentsModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, UsersResolver],
})
export class AppModule {}
