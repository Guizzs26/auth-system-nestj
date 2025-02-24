import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AnyExceptionFilter } from './common/libs/core/exceptions/filters/any-exception.filter';
import { HttpExceptionFilter } from './common/libs/core/exceptions/filters/http-exception.filter';
import { ZodExceptionFilter } from './common/libs/core/exceptions/filters/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const httpAdapterHost = app.get(HttpAdapterHost);

  const config = new DocumentBuilder()
    .setTitle('Auth System')
    .setDescription('A initial auth api')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters(
    new AnyExceptionFilter(httpAdapterHost),
    new HttpExceptionFilter(),
    new ZodExceptionFilter(),
  );

  await app.listen(3000);
}
void bootstrap();
