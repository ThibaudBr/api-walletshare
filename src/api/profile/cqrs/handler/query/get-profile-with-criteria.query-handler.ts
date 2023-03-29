import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileWithCriteriaQuery } from '../../query/get-profile-with-criteria.query';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileResponse } from '../../../domain/response/profile.response';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetProfileWithCriteriaQuery)
export class GetProfileWithCriteriaQueryHandler implements IQueryHandler<GetProfileWithCriteriaQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetProfileWithCriteriaQuery): Promise<ProfileResponse[]> {
    try {
      const queryBuilder = this.profileRepository.createQueryBuilder('profile');

      if (query.getProfileWithCriteriaDto.isDeleted) {
        queryBuilder.setFindOptions({ withDeleted: true });
      }

      if (query.getProfileWithCriteriaDto.usernameProfile) {
        queryBuilder.where('profile.usernameProfile = :usernameProfile', {
          usernameProfile: query.getProfileWithCriteriaDto.usernameProfile,
        });
      }

      const profiles = await queryBuilder.getMany();

      return profiles.map(
        profile =>
          new ProfileResponse({
            ...profile,
          }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'profile',
          handler: 'GetProfileWithCriteriaQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
