import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
import { PrismaService } from '../../prisma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { DailyCheckInsEntity} from "../../typeorm/users/sign/daily_check_ins.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, DailyCheckInsEntity])],
  controllers: [MinecraftController],
  providers: [MinecraftService, PrismaService],
})
export class MinecraftModule {}
