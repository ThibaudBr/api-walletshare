import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfileDto } from './domain/dto/create-profile.dto';
import { ProfileResponse } from './domain/response/profile.response';
import { CreateProfileCommand } from './cqrs/command/create-profile.command';
import { InvalidIdException } from '../../util/exception/custom-http-exception/invalid-id.exception';
import { UserNotFoundException } from '../../util/exception/custom-http-exception/user-not-found.exception';
import { InvalidParameterEntityException } from '../../util/exception/custom-http-exception/invalid-parameter-entity.exception';
import { DeleteProfileCommand } from './cqrs/command/delete-profile.command';
import { UpdateProfileCommand } from './cqrs/command/update-profile.command';
import { UpdateProfileDto } from './domain/dto/update-profile.dto';
import { CreateProfileRequest } from './domain/request/create-profile.request';
import { SoftDeleteProfileCommand } from './cqrs/command/soft-delete-profile.command';
import { UpdateProfileRequest } from './domain/request/update-profile.request';
import { UpdateOccupationsProfileCommand } from './cqrs/command/update-occupations-profile.command';
import { ShiftProfileOwnerCommand } from './cqrs/command/shift-profile-owner.command';
import { ShiftProfileOwnerRequest } from './domain/request/shift-profile-owner.request';
import { GetProfileByIdQuery } from './cqrs/query/get-profile-by-id.query';
import { GetAllProfileQuery } from './cqrs/query/get-all-profile.query';
import { GetProfileWithCriteriaQuery } from './cqrs/query/get-profile-with-criteria.query';
import { GetProfilesWithCriteriaRequest } from './domain/request/get-profiles-with-criteria.request';
import { GetProfilesByUserIdQuery } from './cqrs/query/get-profiles-by-user-id.query';

@Injectable()
export class ProfileService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async createProfile(createProfileRequest: CreateProfileRequest): Promise<ProfileResponse> {
    try {
      return await this.commandBus.execute(
        new CreateProfileCommand({
          createProfileDto: {
            usernameProfile: createProfileRequest.usernameProfile,
            roleProfile: createProfileRequest.roleProfile,
          },
          userId: createProfileRequest.idUser,
          occupationsId: createProfileRequest.occupationsId,
        }),
      );
    } catch (e) {
      if (e.message === 'User not found') throw new UserNotFoundException();
      else if (e instanceof InvalidParameterEntityException) throw e;
      else if (e.message === 'Occupation not found') throw new InvalidIdException();
      else throw new Error(e);
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
      if (e.message === 'Profile not found') throw new InvalidIdException();
      else throw new Error(e);
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
      if (e.message === 'Profile not found') throw new InvalidIdException();
      else throw new Error(e);
    }
  }

  async updateProfile(id: string, updateProfileRequest: UpdateProfileRequest): Promise<void> {
    try {
      if (updateProfileRequest.occupationsId.length > 0) {
        await this.commandBus.execute(
          new UpdateOccupationsProfileCommand({
            id: id,
            occupations: updateProfileRequest.occupationsId,
          }),
        );
      }
      await this.commandBus.execute(
        new UpdateProfileCommand({
          updateProfileDto: {
            usernameProfile: updateProfileRequest.usernameProfile,
            roleProfile: updateProfileRequest.roleProfile,
          },
          id: id,
        }),
      );
    } catch (e) {
      if (e.message === 'Profile not found') throw new InvalidIdException();
      else if (e instanceof InvalidParameterEntityException) throw e;
      else if (e.message === 'User not found') throw new UserNotFoundException();
      else if (e.message === 'Occupation not found') throw new InvalidIdException();
      else throw new Error(e);
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
      if (e.message === 'Profile not found') throw new InvalidIdException();
      else if (e.message === 'User not found') throw new UserNotFoundException();
      else throw new Error(e);
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
      if (e.message === 'Profile not found') throw new InvalidIdException();
      else throw new Error(e);
    }
  }

  async getProfiles(): Promise<ProfileResponse[]> {
    try {
      return await this.queryBus.execute(new GetAllProfileQuery());
    } catch (e) {
      throw new Error(e);
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
      throw new Error(e);
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
      if (e.message === 'User not found') throw new UserNotFoundException();
      throw new Error(e);
    }
  }
}
