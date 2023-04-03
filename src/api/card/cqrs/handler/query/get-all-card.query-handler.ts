import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetAllCardQuery } from '../../query/get-all-card.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { CardDto } from '../../../domain/dto/card.dto';
import { CardResponse } from '../../../web/response/card.response';
import { ProfileResponse } from '../../../../profile/domain/response/profile.response';
import { OccupationResponse } from '../../../../occupation/web/response/occupation-response';
import { GroupMembershipResponse } from '../../../../entities-to-create/response/group-membership.response';

@QueryHandler(GetAllCardQuery)
export class GetAllCardQueryHandler implements IQueryHandler<GetAllCardQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<CardEntity[]> {
    try {
      return await this.cardRepository.find({
        relations: ['occupation', 'owner', 'socialNetwork'],
      });


    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'GetAllCardQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
