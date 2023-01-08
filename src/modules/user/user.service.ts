import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { Authenticate } from '../../typeorm/users/authenticate/authenticate.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Authenticate)
    private authenticateRepository: Repository<Authenticate>,
  ) {}

  //查询用户信息
  async findUserById(query) {
    const findUser = await this.usersRepository.findOne({
      where: {
        id: Number(query.id),
      },
      relations: {
        dailyCheckInsEntity: true,
      },
    });

    return findUser ? { data: findUser } : { msg: '查询不到' };
  }
}
