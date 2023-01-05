import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
import { PrismaService } from '../../prisma.service';
@Module({
  controllers: [MinecraftController],
  providers: [MinecraftService, PrismaService],
})
export class MinecraftModule {}
