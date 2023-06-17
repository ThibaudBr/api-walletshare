import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Wallet Share Main')
    .setDescription('API developed for Application Wallet Share')
    .setVersion(process.env.npm_package_version ?? '0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);
  // Set the config options
  const firebaseConfig = {
    apiKey: configService.get<string>('FIREBASE_API_KEY'),
    authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: configService.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
    appId: configService.get<string>('FIREBASE_APP_ID'),
    measurementId: configService.get<string>('FIREBASE_MEASUREMENT_ID'),
  };

  // Initialize the firebase admin app
  admin.initializeApp(firebaseConfig);

  app.enableCors({
    origin: ['*', process.env.FRONTEND_URL ?? 'http://localhost:8080'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,Set-Cookie,Access-Control-Allow-Origin',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    '[LOG] Server started on port ' + process.env.PORT + ' and listening RCP on port ' + process.env.PORT_TCP,
  );
}

bootstrap()
  .then()
  .catch(error => {
    console.error(error);
  });
