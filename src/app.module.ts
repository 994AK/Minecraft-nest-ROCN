import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MinecraftModule } from './modules/minecraft/minecraft.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
config();

console.log(process.env.MYSQL_HOST, process.env.MYSQL_USERNAME);

const TypeOrm = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [],
  autoLoadEntities: true,
  // 不应在生产中使用 - 打包时候记得关闭
  synchronize: true,
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    MinecraftModule,
    TypeOrm,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
