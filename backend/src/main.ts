import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist:true
    }),
  );
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Agile API')
    .setDescription('API for Agile project management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();


   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);
   

  await app.listen(process.env.APP_PORT);

}
bootstrap();
