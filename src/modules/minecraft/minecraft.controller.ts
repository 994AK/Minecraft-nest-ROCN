import { Controller, Get, Post, Body, UseGuards, Ip, Req } from '@nestjs/common';
import { MinecraftService } from './minecraft.service';
import {
  SignMinecraftDto,
  SignConfigMinecraftDto,
} from './dto/sign-minecraft.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
@Controller('minecraft')
export class MinecraftController {
  constructor(private readonly mcService: MinecraftService) {}

  //查询服务器状态
  @Get('state')
  getMinecraftState() {
    return this.mcService.getMinecraftState();
  }

  //服务器签到状态
  @Post('sign')
  @UseGuards(JwtGuard)
  getMinecraftSign(@Req() req, @Ip() ip, @Body() body: SignMinecraftDto) {
    return this.mcService.getMinecraftSign({
      ...body,
      signIp: ip,
      userId: Number(req.user.id),
    });
  }

  //添加服务器签到奖励
  @Post('addSignConfig')
  @UseGuards(JwtGuard)
  postSignConfigSave(@Body() body: SignConfigMinecraftDto) {
    return this.mcService.postSignConfigSave(body);
  }
}
