import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileByIdQuery } from '../../query/get-profile-by-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileResponse } from '../../../../web/response/profile.response';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetProfileByIdQuery)
export class GetProfileByIdQueryHandler implements IQueryHandler<GetProfileByIdQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetProfileByIdQuery): Promise<ProfileResponse> {
    return await this.profileRepository
      .findOneOrFail({
        relations: ['user', 'occupations'],
        where: [
          {
            id: query.id,
          },
        ],
      })
      .then(
        profile =>
          new ProfileResponse({
            ...profile,
            userId: profile.user?.id,
          }),
      )
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetProfileByIdQueryHandler',
            localisation: 'profileRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });
  }
}
