import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsProfileWithGivenRoleAlreadyExistQuery } from '../../query/is-profile-with-given-role-already-exist.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(IsProfileWithGivenRoleAlreadyExistQuery)
export class IsProfileWithGivenRoleAlreadyExistQueryHandler
  implements IQueryHandler<IsProfileWithGivenRoleAlreadyExistQuery>
{
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsProfileWithGivenRoleAlreadyExistQuery): Promise<boolean> {
    const profiles: ProfileEntity[] = await this.profileRepository
      .find({
        relations: ['user'],
        where: {
          user: {
            id: query.userId,
          },
        },
      })
      .catch(async err => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'IsProfileWithGivenRoleAlreadyExistQueryHandler',
            localisation: 'profileRepository.find',
            error: err,
          }),
        );
        throw new Error('User not found');
      });

    if (profiles.length == 0) return false;
    for (const profile of profiles) {
      if (profile.roleProfile == query.roleProfile) return true;
    }

    return false;
  }
}
