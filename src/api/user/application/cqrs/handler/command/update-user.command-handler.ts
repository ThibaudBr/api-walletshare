import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../../command/update-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { validate } from 'class-validator';
import { InvalidClassException } from '@nestjs/core/errors/exceptions/invalid-class.exception';
import { UpdateUserEvent } from '../../event/update-user.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { UserResponse } from '../../../../web/response/user.response';
import { DuplicateUsernameHttpException } from '../../../../../../util/exception/custom-http-exception/duplicate-username.http-exception';
import { DuplicateMailHttpException } from '../../../../../../util/exception/custom-http-exception/duplicate-mail.http-exception';
import * as bcrypt from 'bcrypt';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    public eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserResponse> {
    try {
      const userToUpdate: UserEntity = await this.userRepository
        .findOneOrFail({
          where: [{ id: command.userId }],
        })
        .catch(async (error: Error) => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'userRepository.findOneOrFail',
              handler: 'UpdateUserCommandHandler',
              error: error.message,
            }),
          );
          throw new Error('User not found');
        });
      if (command.user.username) {
        if (await this.isDuplicatedUsername(command.user.username)) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'isDuplicatedUsername',
              handler: 'UpdateUserCommandHandler',
              error: 'Username already exists',
            }),
          );
          throw new DuplicateUsernameHttpException();
        }
        userToUpdate.username = command.user.username;
      }

      if (command.user.mail) {
        if (await this.isDuplicatedEmail(command.user.mail)) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'isDuplicatedEmail',
              handler: 'UpdateUserCommandHandler',
              error: 'Email already exists',
            }),
          );
          throw new DuplicateMailHttpException();
        }
        userToUpdate.mail = command.user.mail;
      }
      if ((await this.userRepository.findOne({ where: [{ id: command.userId }] })) === undefined) {
        throw new Error('User not found');
      }

      await this.isDuplicateOfDeletedUsername(command.user.username ?? '');
      await this.isDuplicateOfDeletedMail(command.user.mail ?? '');

      const err = await validate(userToUpdate);
      if (err.length > 0) {
        throw new InvalidClassException('Parameter not validate');
      }
      if (command.user.password) {
        userToUpdate.password = bcrypt.hashSync(command.user.password, 10);
      }
      await this.userRepository.save(userToUpdate).catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'userRepository.save',
            handler: 'UpdateUserCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during user update');
      });
      const user: UserEntity = await this.userRepository.findOneOrFail({
        where: [{ id: command.userId }],
      });
      await this.eventBus.publish(new UpdateUserEvent(command.userId));
      return new UserResponse({ ...user });
    } catch (error) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'user',
          handler: 'UpdateUserCommandHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }

  private async isDuplicatedUsername(username: string): Promise<boolean> {
    return await this.userRepository.find().then(users => {
      return users.some(user => user.username === username);
    });
  }

  private async isDuplicatedEmail(email: string): Promise<boolean> {
    return await this.userRepository.find().then(users => {
      return users.some(user => user.mail === email);
    });
  }

  private isValidUsername(username: string): boolean {
    return username.length > 4 && username.length < 20;
  }

  private isValidEmail(email: string): boolean {
    const regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$');
    return regex.test(email);
  }

  private async isDuplicateOfDeletedMail(mail: string): Promise<void> {
    const verifyDuplicateMailWithDeleted: UserEntity | null = await this.userRepository.findOne({
      where: [{ mail: mail }],
      withDeleted: true,
    });
    if (verifyDuplicateMailWithDeleted) {
      if (verifyDuplicateMailWithDeleted?.deletedAt !== null) {
        await this.userRepository.update(verifyDuplicateMailWithDeleted.id, {
          mail: 'deleted' + verifyDuplicateMailWithDeleted.mail + ' ' + Math.random().toString().split('.')[1],
        });
        await this.eventBus.publish(new UpdateUserEvent(verifyDuplicateMailWithDeleted.id));
      }
    }
  }

  private async isDuplicateOfDeletedUsername(username: string): Promise<void> {
    const verifyDuplicateMailWithDeleted: UserEntity | null = await this.userRepository.findOne({
      where: [{ username: username }],
      withDeleted: true,
    });
    if (verifyDuplicateMailWithDeleted !== null) {
      await this.userRepository.update(verifyDuplicateMailWithDeleted.id, {
        username: 'deleted' + verifyDuplicateMailWithDeleted.username + ' ' + Math.random().toString().split('.')[1],
      });
      await this.eventBus.publish(new UpdateUserEvent(verifyDuplicateMailWithDeleted.id));
    }
  }
}
