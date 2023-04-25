import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProfileQuery } from '../../query/get-all-profile.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ProfileResponse } from '../../../../web/response/profile.response';

@QueryHandler(GetAllProfileQuery)
export class GetAllProfileQueryHandler implements IQueryHandler<GetAllProfileQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}
  async execute(): Promise<ProfileResponse[]> {
    try {
      const profiles = await this.profileRepository.find();
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
          handler: 'GetAllProfileQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
