import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCredentialCommand } from '../../command/update-user-credential.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { UpdateUserCredentialEvent } from '../../event/update-user-credential.event';
import * as bcrypt from 'bcrypt';

@CommandHandler(UpdateUserCredentialCommand)
export class UpdateUserCredentialCommandHandler implements ICommandHandler<UpdateUserCredentialCommand> {
  private regexValidatePassword;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {
    this.regexValidatePassword = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$');
  }

  async execute(command: UpdateUserCredentialCommand): Promise<void> {
    try {
      if (command.updateUserCredentialDto.newPassword == command.updateUserCredentialDto.password) {
        throw new Error('New password is the same as old password');
      }
      if (!this.isValidPassword(command.updateUserCredentialDto.newPassword)) {
        throw new Error('Invalid password');
      }
      const user = await this.userRepository.findOne({
        where: { id: command.userId },
        select: ['id', 'password'],
      });
      if (!user) {
        throw new Error('User not found');
      }

      if (!(await this.verifyPassword(command.updateUserCredentialDto.password, user.password))) {
        throw new Error('Invalid old password');
      }

      await this.userRepository.update(command.userId, { password: command.updateUserCredentialDto.newPassword });
      await this.eventBus.publish(new UpdateUserCredentialEvent(command.userId));
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'user', handler: 'UpdateUserCredentialCommandHandler', error: error }),
      );
      throw error;
    }
  }
  private isValidPassword(password: string): boolean {
    return this.regexValidatePassword.test(password);
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
