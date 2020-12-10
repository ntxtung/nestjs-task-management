import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import postgresDbConfig from './config/postgres.db.config';
import { AuthModule } from './modules/auth/auth.module';
import mongoDbConfig from './config/mongo.db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [postgresDbConfig],
    }),
    TypeOrmModule.forRoot(postgresDbConfig),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
