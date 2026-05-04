import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const config = app.get(ConfigService);

  app.use(helmet());
  const isDev = config.get<string>('NODE_ENV') === 'development';
  app.enableCors({
    origin: isDev ? true : config.get<string>('WEB_ORIGIN', 'http://localhost:5173').split(','),
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle('EitaCraque API')
    .setDescription('Backend para a rede social de scouting de futebol')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('API_PORT', 3333);
  const host = config.get<string>('API_HOST', '0.0.0.0');
  await app.listen(port, host);

  console.log(`✓ EitaCraque API rodando em http://${host}:${port}/api/v1`);
  console.log(`✓ Swagger em http://${host}:${port}/docs`);
}

bootstrap();
