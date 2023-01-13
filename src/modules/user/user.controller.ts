import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //查询用户信息
  @Get('findUserById')
  //jwt鉴权
  @UseGuards(JwtGuard)
  async findUserById(@Req() req) {
    return this.userService.findUserById(req.user);
  }

  @Post('fineMultipleUser')
  async fineMultipleUser(@Body() Body) {
    return this.userService.fineMultipleUser(Body);
  }

  //修改用户信息
  @Post('updateFineUser')
  @UseGuards(JwtGuard)
  async updateFineUser(@Req() req, @Body() Body) {
    return this.userService.updateFineUser({ ...req.user, ...Body });
  }
}
