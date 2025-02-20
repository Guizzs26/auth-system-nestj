import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AnyExceptionFilter,
  HttpExceptionFilter,
  ZodExceptionFilter,
} from 'src/common/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new AnyExceptionFilter(httpAdapterHost));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ZodExceptionFilter());

  await app.listen(3000);
}
void bootstrap();
