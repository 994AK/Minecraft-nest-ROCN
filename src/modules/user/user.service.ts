import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrismaService } from '../../prisma.service';
import { Repository } from 'typeorm';
import { User } from '../../typeorm/users/user.entity';
import { Authenticate } from '../../typeorm/users/authenticate.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Authenticate)
    private authenticateRepository: Repository<Authenticate>,
  ) {}

  //用户注册
  async createUser(data) {
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

      return {
        code: 1,
        data: saveUser,
        msg: '用户注册成功',
      };
    }

    // 查询到用户
    if (findUser.length) {
      return {
        code: 2,
        data: null,
        msg: '该用户已被注册',
      };
    }
  }

  //用户登陆
  async loginUser(data) {
    const findUser = await this.authenticateRepository.find({
      // AND 与
      where: {
        username: data.name,
        password: data.password,
      },
      // 返回关系表
      relations: {
        user: true,
      },
    });

    if (findUser.length) {
      return {
        code: 1,
        msg: '登陆成功',
        data: {
          // 返回user表信息
          ...findUser[0].user,
        },
      };
    }

    return {
      code: 2,
      msg: '查不到该用户',
      data: null,
    };
  }

  //查询用户信息
  async findUserById(query: { id: string }) {
    const findUser = await this.usersRepository.find({
      where: {
        id: Number(query.id),
      },
    });

    if (findUser.length) {
      return {
        code: 1,
        msg: '查询成功',
        data: findUser[0],
      };
    }
  }
}
