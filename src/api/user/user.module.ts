import { Module } from '@nestjs/common';
import { UserEntity } from './domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserCommandHandler } from './cqrs/handler/command/create-user.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CqrsModule],
  controllers: [UserController],
  providers: [
    UserService,
    // Command handlers
    CreateUserCommandHandler,
    // Query handlers
    // Event handlers
  ],
})
export class UserModule {}
