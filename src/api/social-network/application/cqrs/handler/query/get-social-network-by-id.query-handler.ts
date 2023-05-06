import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SocialNetworkDto } from '../../../../domain/dto/social-network.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialNetworkEntity } from '../../../../domain/entities/social-network.entity';
import { GetSocialNetworkByIdQuery } from '../../query/get-social-network-by-id.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';

@QueryHandler(GetSocialNetworkByIdQuery)
export class GetSocialNetworkByIdQueryHandler implements IQueryHandler<GetSocialNetworkByIdQuery> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetSocialNetworkByIdQuery): Promise<SocialNetworkDto> {
    return await this.socialNetworkRepository
      .findOneOrFail({
        where: [{ id: query.id }],
      })
      .then(socialNetwork => {
        return new SocialNetworkDto(socialNetwork);
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetSocialNetworkByIdQueryHandler',
            localisation: 'SocialNetworkRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('SocialNetwork not found');
      });
  }
}
