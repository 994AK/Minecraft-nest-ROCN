import { IsString, IsInt } from 'class-validator';
export class SignMinecraftDto {
  @IsInt()
  userId: number;

  //签到留言
  @IsString()
  notes: string;

  signEquipment?: string;

  signIp?: string;
}
