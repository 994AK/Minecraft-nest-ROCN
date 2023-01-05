import { Controller, Get, Query } from '@nestjs/common';
import { MinecraftService } from './minecraft.service';
@Controller('minecraft')
export class MinecraftController {
  constructor(private readonly userService: MinecraftService) {}

  //查询服务器状态
  @Get('state')
  getMinecraftState() {
    return this.userService.getMinecraftState();
  }

  //服务器签到状态
  @Get('sign')
  getMinecraftSign() {
    return this.userService.getMinecraftSign();
  }
}
