import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './cqrs/command/create-user.command';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { CreateUserResponse } from '../web/response/create-user.response';
import { RemoveRefreshTokenCommand } from './cqrs/command/remove-refresh-token.command';
import { SetCurrentRefreshTokenCommand } from './cqrs/command/set-current-refresh-token.command';
import { GetUserIfRefreshTokenMatchesQuery } from './cqrs/query/get-user-if-refresh-token-matches.query';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { GetUserQuery } from './cqrs/query/get-user.query';
import { UpdateUserCommand } from './cqrs/command/update-user.command';
import { UserResponse } from '../web/response/user.response';
import { SoftDeleteUserCommand } from './cqrs/command/soft-delete-user.command';
import { GetUserWithCriteriaQuery } from './cqrs/query/get-user-with-criteria.query';
import { GetUserWithCriteriaDto } from '../domain/dto/get-user-with-criteria.dto';
import { RestoreUserCommand } from './cqrs/command/restore-user.command';
import { UserRoleEnum } from '../domain/enum/user-role.enum';
import { UpdateUserRoleCommand } from './cqrs/command/update-user-role.command';
import { UpdateUserCredentialCommand } from './cqrs/command/update-user-credential.command';
import { UpdateUserCredentialDto } from '../domain/dto/update-user-credential.dto';
import { GenerateUserDto } from '../domain/dto/generate-user.dto';
import { DeleteMailCommand } from '../../api-landing-page/application/cqrs/command/delete-mail.command';
import { DuplicateMailHttpException } from '../../../util/exception/custom-http-exception/duplicate-mail.http-exception';
import { MailRequiredHttpException } from '../../../util/exception/custom-http-exception/mail-required.http-exception';
import { UserNotFoundHttpException } from '../../../util/exception/custom-http-exception/user-not-found.http-exception';
import { DuplicateUsernameHttpException } from '../../../util/exception/custom-http-exception/duplicate-username.http-exception';
import { SamePasswordHttpException } from '../../../util/exception/custom-http-exception/same-password.http-exception';
import { InvalidPasswordHttpException } from '../../../util/exception/custom-http-exception/invalid-password.http-exception';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { DeleteUserCommand } from './cqrs/command/delete-user.command';
import { SendMailCommand } from '../../api-mail/application/cqrs/command/send-mail.command';
import { SaveUserLoginDto } from '../domain/dto/save-user-login.dto';
import { CreateSaveLoginCommand } from './cqrs/command/create-save-login.command';
import { SaveUserLoginResponse } from '../web/response/save-user-login.response';
import { GetSavedCardWithUserIdQuery } from '../../card/application/cqrs/query/get-saved-card-with-user-id.query';
import { CreateStripeCustomerCommand } from '../../payment/stripe/application/cqrs/command/create-stripe-customer.command';
import { CreateReferralCodeStripeCommand } from '../../payment/stripe/application/cqrs/command/create-referral-code-stripe.command';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SetReferralCodeCommand } from './cqrs/command/set-referral-code.command';
import { ReferralCodeEntity } from '../domain/entities/referral-code.entity';
import { ReferralCodeResponse } from '../web/response/referral-code.response';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const createdUser: CreateUserResponse = await this.commandBus.execute(new CreateUserCommand(createUserDto));

    createdUser.stripCustomerId = await this.commandBus.execute(
      new CreateStripeCustomerCommand({
        userId: createdUser.id,
        email: createdUser.mail,
        username: createdUser.username,
      }),
    );

    if (this.configService.get('STRIPE_COUPON_REFERRAL_ID')) {
      const createdReferralCode: Stripe.PromotionCode = await this.commandBus.execute(
        new CreateReferralCodeStripeCommand({
          userId: createdUser.id,
          couponStripeId: this.configService.get('STRIPE_COUPON_REFERRAL_ID'),
          customerStripeId: createdUser.stripCustomerId,
        }),
      );
      createdUser.referralCode = await this.commandBus
        .execute(
          new SetReferralCodeCommand({
            userId: createdUser.id,
            referralCode: createdReferralCode,
          }),
        )
        .catch(error => {
          if (error.message === 'Error while seting referral code') {
            throw new Error('Error while seting referral code');
          }
          throw new InternalServerErrorException('Error while seting referral code');
        })
        .then(ReferralCodeEntity => {
          return new ReferralCodeResponse({
            ...ReferralCodeEntity,
          });
        });
    }

    return createdUser;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<RequestUser> {
    return await this.queryBus.execute(new GetUserIfRefreshTokenMatchesQuery(refreshToken, userId));
  }

  async removeRefreshToken(userId: string): Promise<void> {
    return await this.commandBus.execute(new RemoveRefreshTokenCommand(userId));
  }

  async setCurrentRefreshToken(token: string, userId: string): Promise<void> {
    return await this.commandBus.execute(new SetCurrentRefreshTokenCommand(token, userId));
  }

  async findAll(): Promise<UserResponse[]> {
    return await this.queryBus.execute(new GetUserQuery());
  }

  async findOne(id: string): Promise<UserResponse> {
    try {
      return await this.queryBus.execute(new GetUserQuery(id));
    } catch (error) {
      throw new UserNotFoundHttpException();
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    try {
      return await this.commandBus.execute(new UpdateUserCommand(userId, updateUserDto));
    } catch (error) {
      if (error.message === 'User not found') throw new UserNotFoundHttpException();
      else if (error.message === 'Mail already exists' || error instanceof DuplicateMailHttpException)
        throw new DuplicateMailHttpException();
      else if (error instanceof DuplicateUsernameHttpException || error.message === 'Username already exists') {
        throw new DuplicateUsernameHttpException();
      } else throw Error('not handled error');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      return await this.commandBus.execute(new SoftDeleteUserCommand(id));
    } catch (error) {
      if (error.message === 'User not found') throw new UserNotFoundHttpException();
      else throw error;
    }
  }

  async generateUserFromMail(generateUserDto: GenerateUserDto): Promise<CreateUserResponse> {
    try {
      if (!generateUserDto) throw new Error('Mail is required');
      if ((await this.queryBus.execute(new GetUserWithCriteriaQuery({ mail: generateUserDto.mail }))).length > 0)
        throw new Error('Mail already exists');
      const user = await this.commandBus.execute(
        new CreateUserCommand(
          new CreateUserDto({
            mail: generateUserDto.mail,
            password: this.generatePassword(),
            roles: generateUserDto.roles ? generateUserDto.roles : [UserRoleEnum.PUBLIC],
          }),
        ),
      );

      await this.commandBus.execute(
        new CreateStripeCustomerCommand({
          userId: user.id,
          email: user.mail,
          username: user.username,
        }),
      );

      try {
        await this.commandBus.execute(new DeleteMailCommand({ mail: generateUserDto.mail }));
        await this.commandBus.execute(
          new SendMailCommand({
            email: generateUserDto.mail,
            message: `Bonjour, votre compte a été créé avec succès. Votre mot de passe est : ${user.password}`,
            title: 'Création de compte Wallet Share',
          }),
        );
      } catch (error) {}
      return user;
    } catch (error) {
      if (error.message === 'Mail is required') throw new MailRequiredHttpException();
      else if (error.message === 'Mail already exists') throw new DuplicateMailHttpException();
      else throw error;
    }
  }

  async restoreUser(userId: string): Promise<void> {
    try {
      return await this.commandBus.execute(new RestoreUserCommand({ id: userId }));
    } catch (error) {
      if (error.message === 'User not found') throw new UserNotFoundHttpException();
      else throw error;
    }
  }

  async findWithCriteria(getUserWithCriteriaDto: GetUserWithCriteriaDto): Promise<UserResponse[]> {
    return await this.queryBus.execute(new GetUserWithCriteriaQuery(getUserWithCriteriaDto));
  }

  async getMe(userId: string): Promise<UserResponse> {
    return await this.queryBus.execute(new GetUserQuery(userId));
  }

  async updateRoles(userId: string, roles: UserRoleEnum[]): Promise<UserResponse> {
    try {
      return await this.commandBus.execute(new UpdateUserRoleCommand({ userId: userId, roles: roles }));
    } catch (error) {
      throw new UserNotFoundHttpException();
    }
  }

  async updatePassword(userId: string, updateUserCredentialDto: UpdateUserCredentialDto): Promise<UserResponse> {
    try {
      return await this.commandBus.execute(
        new UpdateUserCredentialCommand({ userId: userId, updateUserCredentialDto: updateUserCredentialDto }),
      );
    } catch (error) {
      if (error.message === 'New password is the same as old password') throw new SamePasswordHttpException();
      else if (error.message === 'User not found') throw new UserNotFoundHttpException();
      else if (error.message === 'Invalid password') throw new InvalidPasswordHttpException();
      else if (error.message === 'Invalid old password') throw new InvalidPasswordHttpException();
      else throw error;
    }
  }

  async deleteMe(userId: string): Promise<void> {
    if (!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.commandBus.execute(new SoftDeleteUserCommand(userId));
  }

  async findMe(userId: string): Promise<UserResponse> {
    if (!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.queryBus.execute(new GetUserQuery(userId));
  }

  async fullDelete(id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand({ userId: id }));
  }

  async saveUserLogin(saveUserLogin: SaveUserLoginDto): Promise<void> {
    return await this.commandBus
      .execute(
        new CreateSaveLoginCommand({
          ...saveUserLogin,
        }),
      )
      .catch(error => {
        if (error.message === 'User not found') throw new UserNotFoundHttpException();
        else throw error;
      });
  }

  async getLoginHistory(userId: string): Promise<SaveUserLoginResponse[]> {
    return await this.queryBus.execute(
      new GetSavedCardWithUserIdQuery({
        userId: userId,
      }),
    );
  }

  private generatePassword(): string {
    return 'Pt' + Math.random().toString(10).split('.')[1] + '!';
  }

  async getAllUserCount(): Promise<number> {
    return await this.findAll().then(users => users.length);
  }
}
