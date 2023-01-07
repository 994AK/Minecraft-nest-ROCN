import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
import { PrismaService } from '../../prisma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, DailyCheckInsEntity, SignDailyLog } from './typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DailyCheckInsEntity, SignDailyLog]),
  ],
  controllers: [MinecraftController],
  providers: [MinecraftService, PrismaService],
})
export class MinecraftModule {}
