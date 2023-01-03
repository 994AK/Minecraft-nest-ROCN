import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data) {
    // 邮箱不能为空
    if (!data.email) {
      return {
        code: '2',
        data: null,
        msg: '邮箱不能为空'
      }
    }

    // 用户名不能为空
    if (!data.name) {
      return {
        code: '2',
        data: null,
        msg: '用户名不能为空'
      }
    }

    // 先查询用户是否存在
    const getUser = await this.prisma.user.findMany({
      where: {
        OR: [
          { email : data.email},
          { name : data.name}
        ]
      },
    })

    if (!getUser.length) {
      const userCreate = await this.prisma.user.create({
        data,
      });

      return {
        code: '1',
        data: userCreate,
        msg: '添加用户成功'
      }
    } else {
      return {
        code: '2',
        data: null,
        msg: '用户已存在'
      }
    }


  }
}
