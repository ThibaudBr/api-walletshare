import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSocialNetworkQuery } from '../../query/get-all-social-network.query';
import { SocialNetworkEntity } from '../../../../domain/entities/social-network.entity';
import { SocialNetworkDto } from '../../../../domain/dto/social-network.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';

@QueryHandler(GetAllSocialNetworkQuery)
export class GetAllSocialNetworkQueryHandler implements IQueryHandler<GetAllSocialNetworkQuery> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<SocialNetworkDto[]> {
    return await this.socialNetworkRepository
      .find()
      .then(socialNetworks => {
        return socialNetworks.map(socialNetwork => {
          return new SocialNetworkDto(socialNetwork);
        });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllSocialNetworkQueryHandler',
            localisation: 'SocialNetworkRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Error while getting all social networks');
      });
  }
}
