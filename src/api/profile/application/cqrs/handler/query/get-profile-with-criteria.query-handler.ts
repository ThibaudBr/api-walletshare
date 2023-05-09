import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileWithCriteriaQuery } from '../../query/get-profile-with-criteria.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileResponse } from '../../../../web/response/profile.response';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetProfileWithCriteriaQuery)
export class GetProfileWithCriteriaQueryHandler implements IQueryHandler<GetProfileWithCriteriaQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetProfileWithCriteriaQuery): Promise<ProfileResponse[]> {
    const queryBuilder = this.profileRepository.createQueryBuilder('profile');

    if (query.getProfileWithCriteriaDto.isDeleted) {
      queryBuilder.setFindOptions({ withDeleted: true, relations: ['user', 'occupations'] });
    } else {
      queryBuilder.setFindOptions({ relations: ['user', 'occupations'] });
    }

    if (query.getProfileWithCriteriaDto.usernameProfile) {
      queryBuilder.where('profile.usernameProfile = :usernameProfile', {
        usernameProfile: query.getProfileWithCriteriaDto.usernameProfile,
      });
    }

    const profiles = await queryBuilder.getMany().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'GetProfileWithCriteriaQueryHandler',
          localisation: 'profileRepository.find',
          error: error.message,
        }),
      );
      throw new Error('Profile not found');
    });

    return profiles.map(
      profile =>
        new ProfileResponse({
          ...profile,
          userId: profile.user.id,
        }),
    );
  }
}