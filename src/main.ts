import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { HttpExecptionFilter } from './http-execption.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<any>(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  //全局前缀
  app.setGlobalPrefix('api');

  //全局DTO
  app.useGlobalPipes(new ValidationPipe());

  // 注册响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExecptionFilter());

  // 静态文件
  app.useStaticAssets(join(__dirname, '..', 'files'));

  await app.listen(3000);

  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
