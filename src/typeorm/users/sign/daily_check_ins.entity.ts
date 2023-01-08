// 签到信息表 日记
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';
@Entity()
export class DailyCheckInsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //签到时间
  @CreateDateColumn()
  checkInDate: Date;

  //签到时间
  @UpdateDateColumn()
  updatedDate: Date;

  //签到留言
  @Column()
  notes: string;

  //签到次数
  @Column()
  numSign: number;

  @Column({ default: false })
  signShow: boolean;

  //关联user表
  @ManyToOne(() => User, (user) => user.dailyCheckInsEntity)
  user: User;
}
