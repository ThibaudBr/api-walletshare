import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsProfileOwnerWithUserIsQuery } from '../../query/is-profile-owner-with-user-is.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(IsProfileOwnerWithUserIsQuery)
export class IsProfileOwnerWithUserIsQueryHandler implements IQueryHandler<IsProfileOwnerWithUserIsQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsProfileOwnerWithUserIsQuery): Promise<boolean> {
    const profile = await this.profileRepository
      .findOneOrFail({
        relations: ['user'],
        where: [
          {
            id: query.profileId,
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'IsProfileOwnerWithUserIsQueryHandler',
            localisation: 'profileRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw error;
      });

    return profile.user.id === query.userId;
  }
}