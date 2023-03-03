import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppTestE2eController } from './app-test-e2e.controller';
import { AppTestE2eService } from './app-test-e2e.service';
import { AppModule } from '../../src/app.module';

@Module({
  imports: [AppModule, TypeOrmModule.forFeature([])],
  controllers: [AppTestE2eController],
  providers: [AppTestE2eService],
})
export class AppTestE2eModule {}
