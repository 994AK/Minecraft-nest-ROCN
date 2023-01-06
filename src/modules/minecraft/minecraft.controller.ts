import { Controller, Get, Post, Body } from '@nestjs/common';
import { MinecraftService } from './minecraft.service';
import { SignMinecraftDto } from './dto/sign-minecraft.dto';
@Controller('minecraft')
export class MinecraftController {
  constructor(private readonly userService: MinecraftService) {}

  //查询服务器状态
  @Get('state')
  getMinecraftState() {
    return this.userService.getMinecraftState();
  }

  //服务器签到状态
  @Post('sign')
  getMinecraftSign(@Body() body: SignMinecraftDto) {
    return this.userService.getMinecraftSign(body);
  }
}
