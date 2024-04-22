import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect'; // Auth0
import { config as Auth0Config } from './config/autho.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { DateAdderInterceptor } from './interceptors/date-adder.interceptor';
// import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription(
      'Esta es una API construida con Nest empleada como demos para el modulo 4 de la especialidad Backend de la carrera FullStack developer de Henry',
    )
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

  app.use(LoggerGlobal);
  // app.useGlobalGuards(new AuthGuard());
  // app.useGlobalInterceptors(new DateAdderInterceptor());
  app.use(auth(Auth0Config));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
