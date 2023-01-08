import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  DailyCheckInsEntity,
  SignDailyLog,
  SignDailyConfig,
} from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DailyCheckInsEntity,
      SignDailyLog,
      SignDailyConfig,
    ]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
