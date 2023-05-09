import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateSaveLoginCommand } from '../../command/create-save-login.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginEntity } from '../../../../domain/entities/user-login.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { CreateSaveLoginEvent } from '../../event/create-save-login.event';
import {ErrorCustomEvent} from "../../../../../../util/exception/error-handler/error-custom.event";

@CommandHandler(CreateSaveLoginCommand)
export class CreateSaveLoginCommandHandler implements ICommandHandler<CreateSaveLoginCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserLoginEntity)
    private readonly userLoginRepository: Repository<UserLoginEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateSaveLoginCommand): Promise<void> {
    const userEntity: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateSaveLoginCommandHandler',
            error: error,
            localisation: 'userRepository.findOneOrFail',
          }),
        );
        throw new Error('User not found');
      });

    const userLoginEntity: UserLoginEntity = this.userLoginRepository.create({
      user: userEntity,
      device: command.device,
      ip: command.ip,
      os: command.os,
    });

    await this.userLoginRepository.save(userLoginEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateSaveLoginCommandHandler',
          error: error,
          localisation: 'userLoginRepository.save',
        }),
      );
      throw new Error('User login not saved');
    });

    await this.eventBus.publish(
      new CreateSaveLoginEvent({
        userId: command.userId,
      }),
    );
  }
}
