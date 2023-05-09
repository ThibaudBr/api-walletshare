import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { ProfileResponse } from '../web/response/profile.response';
import { CreateProfileCommand } from './cqrs/command/create-profile.command';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { UserNotFoundHttpException } from '../../../util/exception/custom-http-exception/user-not-found.http-exception';
import { InvalidParameterEntityHttpException } from '../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { DeleteProfileCommand } from './cqrs/command/delete-profile.command';
import { UpdateProfileCommand } from './cqrs/command/update-profile.command';
import { CreateProfileRequest } from '../web/request/create-profile.request';
import { SoftDeleteProfileCommand } from './cqrs/command/soft-delete-profile.command';
import { UpdateProfileRequest } from '../web/request/update-profile.request';
import { UpdateOccupationsProfileCommand } from './cqrs/command/update-occupations-profile.command';
import { ShiftProfileOwnerCommand } from './cqrs/command/shift-profile-owner.command';
import { ShiftProfileOwnerRequest } from '../web/request/shift-profile-owner.request';
import { GetProfileByIdQuery } from './cqrs/query/get-profile-by-id.query';
import { GetAllProfileQuery } from './cqrs/query/get-all-profile.query';
import { GetProfileWithCriteriaQuery } from './cqrs/query/get-profile-with-criteria.query';
import { GetProfilesWithCriteriaRequest } from '../web/request/get-profiles-with-criteria.request';
import { GetProfilesByUserIdQuery } from './cqrs/query/get-profiles-by-user-id.query';
import { NotTheOwnerHttpException } from '../../../util/exception/custom-http-exception/not-the-owner.http-exception';
import { RestoreProfileCommand } from './cqrs/command/restore-profile.command';
import { EntityIsNotSoftDeletedHttpException } from '../../../util/exception/custom-http-exception/entity-is-not-soft-deleted.http-exception';
import { RoleProfileEnum } from '../domain/enum/role-profile.enum';
import { ErrorCustomEvent } from '../../../util/exception/error-handler/error-custom.event';
import { IsProfileWithGivenRoleAlreadyExistQuery } from './cqrs/query/is-profile-with-given-role-already-exist.query';

@Injectable()
export class ProfileService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async createProfile(userId: string, createProfileRequest: CreateProfileRequest): Promise<ProfileResponse> {
    try {
      if (createProfileRequest.roleProfile !== RoleProfileEnum.CLASSIC) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'ProfileService.createProfile',
            handler: 'ProfileService',
            error: 'User can only have one profile with role classic',
          }),
        );
        throw new ForbiddenException('User can only have one profile with role classic');
      }
      if (
        !(await this.queryBus.execute(
          new IsProfileWithGivenRoleAlreadyExistQuery({
            roleProfile: createProfileRequest.roleProfile,
            userId: userId,
          }),
        ))
      ) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'ProfileService.createProfile',
            handler: 'ProfileService',
            error: 'Profile with given role already exist',
          }),
        );
        throw new ForbiddenException('Profile with given role already exist');
      }
      return await this.commandBus.execute(
        new CreateProfileCommand({
          createProfileDto: {
            usernameProfile: createProfileRequest.usernameProfile,
            roleProfile: createProfileRequest.roleProfile,
          },
          userId: userId,
          occupationsId: createProfileRequest.occupationsId,
        }),
      );
    } catch (e) {
      if (e.message === 'User not found') throw new UserNotFoundHttpException();
      else if (e instanceof Array) throw new InvalidParameterEntityHttpException(e);
      else if (e.message === 'Occupation not found') throw new InvalidIdHttpException();
      else if (e.message === 'Profile with given role already exist') throw new ForbiddenException(e.message);
      else throw e;
    }
  }

  async createProfileAdmin(createProfileRequest: CreateProfileRequest): Promise<ProfileResponse> {
    try {
      return await this.commandBus.execute(
        new CreateProfileCommand({
          createProfileDto: {
            usernameProfile: createProfileRequest.usernameProfile,
            roleProfile: createProfileRequest.roleProfile,
          },
          userId: createProfileRequest.userId,
          occupationsId: createProfileRequest.occupationsId,
        }),
      );
    } catch (e) {
      if (e.message === 'User not found') throw new UserNotFoundHttpException();
      else if (e instanceof Array) throw new InvalidParameterEntityHttpException(e);
      else if (e.message === 'Occupation not found') throw new InvalidIdHttpException();
      else throw e;
    }
  }

  async deleteProfile(id: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new DeleteProfileCommand({
          id: id,
        }),
      );
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      else throw e;
    }
  }

  async softDeleteProfile(id: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new SoftDeleteProfileCommand({
          id: id,
        }),
      );
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      else throw e;
    }
  }

  async updateProfile(id: string, updateProfileRequest: UpdateProfileRequest): Promise<void> {
    try {
      if (updateProfileRequest.occupationsId) {
        await this.commandBus.execute(
          new UpdateOccupationsProfileCommand({
            id: id,
            occupations: updateProfileRequest.occupationsId,
          }),
        );
      }
      if (updateProfileRequest.roleProfile && updateProfileRequest.usernameProfile) {
        await this.commandBus.execute(
          new UpdateProfileCommand({
            updateProfileDto: {
              usernameProfile: updateProfileRequest.usernameProfile,
              roleProfile: updateProfileRequest.roleProfile,
            },
            id: id,
          }),
        );
      }
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      else if (e instanceof Array) throw new InvalidParameterEntityHttpException(e);
      else if (e.message === 'User not found') throw new UserNotFoundHttpException();
      else if (e.message === 'Occupation not found') throw new InvalidIdHttpException();
      else throw e;
    }
  }

  async updateMyProfile(id: string, updateProfileRequest: UpdateProfileRequest): Promise<void> {
    try {
      await this.queryBus
        .execute(
          new GetProfileByIdQuery({
            id: updateProfileRequest.profileId,
          }),
        )
        .then(profile => {
          if (profile.userId !== id) {
            throw new Error('User is not he owner of the profile');
          }
        })
        .catch(error => {
          if (error.message == 'User is not he owner of the profile') throw error;
          throw new Error('Profile not found');
        });
      if (updateProfileRequest.occupationsId) {
        await this.commandBus.execute(
          new UpdateOccupationsProfileCommand({
            id: updateProfileRequest.profileId,
            occupations: updateProfileRequest.occupationsId,
          }),
        );
      }
      if (updateProfileRequest.usernameProfile) {
        await this.commandBus.execute(
          new UpdateProfileCommand({
            updateProfileDto: {
              usernameProfile: updateProfileRequest.usernameProfile,
            },
            id: updateProfileRequest.profileId,
          }),
        );
      }
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      else if (e instanceof InvalidParameterEntityHttpException) throw e;
      else if (e.message === 'User not found') throw new UserNotFoundHttpException();
      else if (e.message === 'Occupation not found') throw new InvalidIdHttpException();
      else if (e.message === 'User is not he owner of the profile') throw new NotTheOwnerHttpException();
      else throw e;
    }
  }

  async shiftProfileOwner(shiftProfileOwnerRequest: ShiftProfileOwnerRequest): Promise<ProfileResponse> {
    try {
      return await this.commandBus.execute(
        new ShiftProfileOwnerCommand({
          profileId: shiftProfileOwnerRequest.profileId,
          userId: shiftProfileOwnerRequest.userId,
        }),
      );
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      else if (e.message === 'User not found') throw new UserNotFoundHttpException();
      else throw e;
    }
  }

  // Get
  async getProfile(id: string): Promise<ProfileResponse> {
    try {
      return await this.queryBus.execute(
        new GetProfileByIdQuery({
          id: id,
        }),
      );
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      else throw e;
    }
  }

  async getProfiles(): Promise<ProfileResponse[]> {
    try {
      return await this.queryBus.execute(new GetAllProfileQuery());
    } catch (e) {
      throw e;
    }
  }

  async getProfilesWithCriteria(
    getProfileWithCriteriaRequest: GetProfilesWithCriteriaRequest,
  ): Promise<ProfileResponse[]> {
    try {
      return await this.queryBus.execute(
        new GetProfileWithCriteriaQuery({
          getProfileWithCriteriaDto: {
            usernameProfile: getProfileWithCriteriaRequest.usernameProfile,
            roleProfile: getProfileWithCriteriaRequest.roleProfile,
            isDeleted: getProfileWithCriteriaRequest.isDeleted,
          },
        }),
      );
    } catch (e) {
      throw e;
    }
  }

  async getProfileByUserId(userId: string): Promise<ProfileResponse[]> {
    try {
      return await this.queryBus.execute(
        new GetProfilesByUserIdQuery({
          id: userId,
        }),
      );
    } catch (e) {
      if (e.message === 'User not found') throw new UserNotFoundHttpException();
      throw e;
    }
  }

  async getMyProfile(userId: string, profileId: string): Promise<ProfileResponse> {
    try {
      return await this.queryBus
        .execute(
          new GetProfileByIdQuery({
            id: profileId,
          }),
        )
        .then(profile => {
          if (profile.userId !== userId) {
            throw new Error('User is not he owner of the profile');
          }
          return profile;
        });
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      else if (e.message === 'User is not he owner of the profile') throw new NotTheOwnerHttpException();
      else throw e;
    }
  }

  async restoreProfile(id: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new RestoreProfileCommand({
          profileId: id,
        }),
      );
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdHttpException();
      if (e.message === 'Profile is not soft deleted') throw new EntityIsNotSoftDeletedHttpException(e.message);
      else throw e;
    }
  }
}
