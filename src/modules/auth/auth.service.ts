import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { Authenticate } from '../../typeorm/users/authenticate/authenticate.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    // user用户信息
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // Auth登陆注册
    @InjectRepository(Authenticate)
    private authenticateRepository: Repository<Authenticate>,

    //Jwt
    private jwt: JwtService,

    //config
    private config: ConfigService,
  ) {}

  //用户注册
  async createUser(data: CreateUserDto) {
    const findUser = await this.usersRepository.find({
      // OR 或
      where: [{ name: data.name }, { email: data.email }],
    });

    // 查询不到用户创建
    if (!findUser.length) {
      // 添加用户表
      const user = new User();
      user.name = data.name;
      user.email = data.email;
      const saveUser = await this.usersRepository.save(user);

      // 添加登陆表
      const authenticate = new Authenticate();
      authenticate.username = data.name;
      authenticate.password = data.password;
      authenticate.user = user;
      await this.authenticateRepository.save(authenticate);

      return saveUser;
    }

    throw new BadRequestException('用户存在');
  }

  //用户登陆
  async loginUser(data: LoginUserDto) {
    const findUser = await this.authenticateRepository.findOne({
      // AND 与
      where: {
        username: data.name,
        password: data.password,
      },
      relations: {
        user: true,
      },
    });

    if (!findUser) {
      throw new BadRequestException('请检查用户名或密码');
    }

    return await this.signToken(findUser.user.id, findUser.user.email);
  }

  //token
  async signToken(
    userId: any,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET_KEY');

    const token = await this.jwt.signAsync(payload, {
      // expiresIn: '15m', //可选,如果没设置就不会过期
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
