import { IsString, IsInt, IsNumber } from 'class-validator';
export class SignMinecraftDto {
  @IsInt()
  userId: number;

  //签到留言
  @IsString()
  notes: string;

  signEquipment?: string;

  signIp?: string;
}

export class SignConfigMinecraftDto {
  signId?: string;
  signCmiDirectives?: string;

  @IsString()
  signName: string;

  @IsNumber()
  signCondition: number;

  @IsNumber()
  signNum: number;

  @IsNumber()
  typeSignConfig: number;
}
