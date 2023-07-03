import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ForbiddenException } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Wallet Share Main')
    .setDescription('API developed for Application Wallet Share')
    .setVersion(process.env.npm_package_version ?? '0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);

  admin.initializeApp({
    databaseURL: 'http://' + configService.get<string>('FIREBASE_PROJECT_ID') + '.firebaseio.com/',
    serviceAccountId: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_ID'),
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    credential: admin.credential.cert({
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
    }),
  });

  app.enableCors({
    origin: function (origin, callback) {
      const whitelist = [
        '*',
        'http://localhost:3000',
        'http://192.168.1.22:3000',
        configService.get<string>('HOST_DASHBOARD_ADMIN') ?? 'http://localhost:8080',
        configService.get<string>('HOST_DASHBOARD_CLIENT') ?? 'http://localhost:8081',
        configService.get<string>('HOST_API_WAITING_LIST') ?? 'http://localhost:3003',
        configService.get<string>('HOST_API_MAIL') ?? 'http://localhost:3002',
        configService.get<string>('HOST_API_LOG') ?? 'http://localhost:3001',
      ];

      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,Set-Cookie,Access-Control-Allow-Origin',
  });
  await app.listen(configService.get<string>('PORT') ?? 3000);
  console.log('[LOG] Server started on port ' + configService.get<string>('PORT'));
}

bootstrap()
  .then()
  .catch(error => {
    console.error(error);
  });
