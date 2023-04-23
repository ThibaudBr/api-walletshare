import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfilesByUserIdQuery } from '../../query/get-profiles-by-user-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../user/domain/entities/user.entity';
import { ProfileResponse } from '../../../domain/response/profile.response';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetProfilesByUserIdQuery)
export class GetProfilesByUserIdQueryHandler implements IQueryHandler<GetProfilesByUserIdQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetProfilesByUserIdQuery): Promise<ProfileResponse[]> {
    try {
      const user = await this.userRepository
        .findOneOrFail({
          relations: ['profiles', 'profiles.occupations'],
          where: {
            id: query.id,
          },
        })
        .catch(() => {
          throw new Error('User not found');
        });

      return user.profiles.map(profile => {
        return new ProfileResponse({
          ...profile,
          userId: user.id,
        });
      });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'GetProfilesByUserIdQueryHandler',
          localisation: 'profile',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
