import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SocialNetworkDto } from '../../../../domain/dto/social-network.dto';
import { GetSocialNetworkWithCriteriaQuery } from '../../query/get-social-network-with-criteria.query';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialNetworkEntity } from '../../../../domain/entities/social-network.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetSocialNetworkWithCriteriaQuery)
export class GetSocialNetworkWithCriteriaQueryHandler implements IQueryHandler<GetSocialNetworkWithCriteriaQuery> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetSocialNetworkWithCriteriaQuery): Promise<SocialNetworkDto[]> {
    try {
      const queryBuilder = this.socialNetworkRepository.createQueryBuilder('socialNetwork');
      if (query.isDeleted) {
        queryBuilder.setFindOptions({ withDeleted: true });
      }

      if (query.name) {
        queryBuilder.where('socialNetwork.name = :nameSocialNetwork', {
          nameSocialNetwork: query.name,
        });
      }

      const socialNetworks = await queryBuilder.getMany();

      return socialNetworks.map(
        socialNetwork =>
          new SocialNetworkDto({
            ...socialNetwork,
          }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'socialNetwork',
          handler: 'GetSocialNetworkWithCriteriaQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
