// 用户签到日志表
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class SignDailyLog {
  @PrimaryGeneratedColumn()
  id: number;

  //签到时间
  @UpdateDateColumn()
  updatedDate: Date;

  //签到留言
  @Column()
  notes: string;

  //签到积分
  @Column({ nullable: true })
  signIntegral: number;

  //签到设备
  @Column({ nullable: true })
  signEquipment: string;

  //签到ip
  @Column({ nullable: true })
  signIp?: string;

  //关联user表
  @ManyToOne(() => User, (user) => user.signDailyLog)
  user: User;
}
