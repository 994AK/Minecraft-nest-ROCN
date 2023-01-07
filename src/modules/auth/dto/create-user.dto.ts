import { Length, IsString, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '请输入用户名' })
  @IsString()
  @Length(2, 50)
  name: string;

  @IsNotEmpty({ message: '请输入密码' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: '请输入密码' })
  @IsString()
  password: string;
}
