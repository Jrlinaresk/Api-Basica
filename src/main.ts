import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Api Basica')
    .setDescription('Prueba Tegnica')
    .setVersion('0.0.1')
    .setContact(
      'Jorge R Linares Castillo',
      'jrlinaresk@gmail.com',
      'https://www.linkedin.com/in/digitalexport/',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  await app.listen(8080);
}

bootstrap();
