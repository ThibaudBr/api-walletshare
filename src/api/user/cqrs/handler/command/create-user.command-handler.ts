import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../command/create-user.command';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DuplicateUsernameException } from '../../../../../util/exception/custom-http-exception/duplicate-username.exception';
import { DuplicateEmailException } from '../../../../../util/exception/custom-http-exception/duplicate-email.exception';
import { InvalidParameterEntityException } from '../../../../../util/exception/custom-http-exception/invalid-parameter-entity.exception';
import { CreateUserResponse } from '../../../domain/response/create-user.response';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    try {
      const newUser: UserEntity = new UserEntity({ ...command.createUserDto });

      const err = await validate(newUser);
      if (err.length > 0) {
        throw new InvalidParameterEntityException(err);
      }

      // verify that email is unique
      const userUniqueEmail = await this.userRepository.findBy({ email: command.createUserDto.email });
      if (userUniqueEmail.length > 0) {
        throw new DuplicateEmailException();
      }

      // verify that username is unique
      const userUniqueUsername = await this.userRepository.findBy({ username: command.createUserDto.username });
      if (userUniqueUsername.length > 0) {
        throw new DuplicateUsernameException();
      }

      const savedUser: UserEntity = await this.userRepository.save(newUser);

      return new CreateUserResponse({
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        userRoles: savedUser.userRoles,
      });
    } catch (error) {
      if (
        error instanceof InvalidParameterEntityException ||
        error instanceof DuplicateEmailException ||
        error instanceof DuplicateUsernameException
      ) {
        throw error;
      }
      throw new Error('Error executing CreateUserCommand: ' + error.message);
    }
  }
}
