import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
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
  controllers: [MinecraftController],
  providers: [MinecraftService],
})
export class MinecraftModule {}
