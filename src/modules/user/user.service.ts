import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { Authenticate } from '../../typeorm/users/auth/authenticate.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Authenticate)
    private authenticateRepository: Repository<Authenticate>,
  ) {}

  //查询用户信息
  async findUserById(query: { id: string }) {
    const findUser = await this.usersRepository.find({
      where: {
        id: Number(query.id),
      },
    });

    return findUser.length ? { data: findUser[0] } : { msg: '查询不到' };
  }
}
