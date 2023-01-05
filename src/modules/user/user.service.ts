import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //用户注册
  async createUser(data) {
    try {
      //查询是否有当前用户
      const findUser = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: data.name,
              },
            },
            {
              email: {
                contains: data.email,
              },
            },
          ],
        },
      });

      if (!findUser.length) {
        //注册模块
        const userCreate = await this.prisma.user.create({
          data,
        });
        return {
          code: 1,
          msg: '注册成功',
          data: userCreate,
        };
      } else {
        return {
          code: 2,
          msg: '该用户已被注册',
          data: null,
        };
      }
    } catch (err) {
      return {
        code: 0,
        msg: '未知错误',
        data: null,
      };
    }
  }

  //用户登陆
  async loginUser(data: { username: string; password: string }) {
    try {
      const login = await this.prisma.authenticate.findUnique({
        where: {
          login: data,
        },
        select: {
          userInfo: true,
        },
      });
      return {
        code: 1,
        msg: '登陆成功',
        data: {
          ...login.userInfo,
        },
      };
    } catch (err) {
      return {
        code: 2,
        msg: '登陆失败,请检查用户名与密码',
        data: null,
      };
    }
  }

  //查询用户信息
  async findUserById(query) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: Number(query.id),
        },
      });

      return {
        code: 1,
        data: user,
        msg: '查询成功',
      };
    } catch (err) {
      return {
        code: 2,
        data: null,
        msg: '查询失败,没有这个人',
      };
    }
  }
}
