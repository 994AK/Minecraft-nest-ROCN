import { Controller,Post,Body } from '@nestjs/common';

import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  async signupUser(
    @Body() userData: { name: string; email: string; password: string},
  ){
    return this.userService.createUser(userData);
  }

}
