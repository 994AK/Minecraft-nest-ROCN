import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MinecraftModule } from './modules/minecraft/minecraft.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const TypeOrm = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'typeorm',
  entities: [],
  autoLoadEntities: true,
  // 不应在生产中使用 - 打包时候记得关闭
  synchronize: true,
});

@Module({
  imports: [UserModule, AuthModule, MinecraftModule, TypeOrm],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
