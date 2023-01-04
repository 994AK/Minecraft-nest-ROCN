import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //用户注册
  async createUser(data) {
    // 邮箱不能为空
    if (!data.email) {
      return {
        code: '2',
        data: null,
        msg: '邮箱不能为空',
      };
    }

    // 用户名不能为空
    if (!data.name) {
      return {
        code: '2',
        data: null,
        msg: '用户名不能为空',
      };
    }

    // 先查询用户是否存在
    const getUser = await this.prisma.user.findMany({
      where: {
        OR: [{ email: data.email }, { name: data.name }],
      },
    });

    if (!getUser.length) {
      const userCreate = await this.prisma.user.create({
        data,
      });

      return {
        code: '1',
        data: userCreate,
        msg: '添加用户成功',
      };
    } else {
      return {
        code: '2',
        data: null,
        msg: '用户已存在',
      };
    }
  }

  //用户登陆
  async loginUser(data) {
    if (!data.name) {
      return {
        code: '2',
        data: null,
        msg: '用户名不能为空',
      };
    }

    if (!data.password) {
      return {
        code: '2',
        data: null,
        msg: '密码不能为空',
      };
    }

    const login = await this.prisma.user.findMany({
      where: {
        AND: [{ name: data.name }, { password: data.password }],
      },
    });

    if (login.length === 0) {
      return {
        code: '2',
        data: null,
        msg: '请检查下用户账号密码是否正确?',
      };
    }

    // 删除密码信息
    delete login[0]?.password;
    // 删除邮箱信息
    delete login[0]?.email;

    return {
      code: '1',
      data: login[0],
      msg: '登陆成功',
    };
  }

  //查询用户信息
  async findUserById(query) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(query.id),
      },
    });

    if (!user) {
      return {
        code: '2',
        data: null,
        msg: '没有这个人',
      };
    }

    // 删除密码信息
    delete user?.password;
    // 删除邮箱信息
    delete user?.email;

    return {
      code: '1',
      data: user,
      msg: '查询成功',
    };
  }
}
