import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';
import { config } from 'aws-sdk';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Wallet Share Main')
    .setDescription('API developed for Application Wallet Share')
    .setVersion(process.env.npm_package_version || '0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,Set-Cookie,Access-Control-Allow-Origin',
  });
  const tcpOptions: TcpOptions = {
    transport: Transport.TCP,
    options: {
      port: Number(process.env.PORT_TCP || 3100),
    },
  };

  config.update({
    region: process.env.AWS_REGION,
  });

  app.connectMicroservice<MicroserviceOptions>(tcpOptions);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() =>
  console.log(
    '[LOG] Server started on port ' + process.env.PORT + ' and listening RCP on port ' + process.env.PORT_TCP,
  ),
);
