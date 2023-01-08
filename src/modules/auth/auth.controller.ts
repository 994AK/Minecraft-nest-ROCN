import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() userData: CreateUserDto) {
    console.log(userData);
    return this.userService.createUser(userData);
  }

  @Post('login')
  async loginUser(@Body() userData: LoginUserDto) {
    return this.userService.loginUser(userData);
  }
}
