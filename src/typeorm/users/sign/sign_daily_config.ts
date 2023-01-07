// 用户签到日志表
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class SignDailyConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  typeSignConfig: number;

  @Column({ nullable: true })
  signId: string;

  @Column()
  signNum: number;

  @Column()
  signCondition: number;

  @Column()
  signName: string;

  @Column({ nullable: true })
  signCmiDirectives: string;
}
