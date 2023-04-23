import { Injectable } from '@nestjs/common';
import { ProfileEntity } from '../../../src/api/profile/domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileRequest } from '../../../src/api/profile/domain/request/create-profile.request';
import { UserEntity } from '../../../src/api/user/domain/entities/user.entity';
import { OccupationEntity } from '../../../src/api/occupation/domain/entities/occupation.entity';

@Injectable()
export class ProfileTestE2eService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
  ) {}

  async createProfileTest(createProfileRequest: CreateProfileRequest): Promise<ProfileEntity> {
    try {
      const newProfile = new ProfileEntity({
        usernameProfile: createProfileRequest.usernameProfile,
        roleProfile: createProfileRequest.roleProfile,
        occupations: [],
      });
      newProfile.user = await this.userRepository.findOneOrFail({
        where: {
          id: createProfileRequest.userId,
        },
      });
      for (const occupationId of createProfileRequest.occupationsId) {
        newProfile.occupations?.push(
          await this.occupationRepository.findOneOrFail({
            where: {
              id: occupationId,
            },
          }),
        );
      }

      return await this.profileRepository.save(newProfile);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async removeProfile(profileId: string): Promise<void> {
    await this.profileRepository.softDelete(profileId);
  }

  async getProfile(profileId: string): Promise<ProfileEntity | null> {
    return await this.profileRepository.findOne({
      relations: ['user', 'occupations'],
      where: {
        id: profileId,
      },
    });
  }

  async getAllProfiles(): Promise<ProfileEntity[]> {
    return await this.profileRepository.find({
      withDeleted: true,
      relations: ['user', 'occupations'],
    });
  }
}
