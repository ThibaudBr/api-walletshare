import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateSubscriptionEvent } from '../../event/create-subscription.event';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from '../../../../../price/domain/entities/price.entity';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateSubscriptionEvent)
export class CreateSubscriptionEventHandler implements IEventHandler<CreateSubscriptionEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateSubscriptionEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: 'CreateSubscriptionEventHandler',
      body: 'Subscription created with id ' + event.subscriptionId + ' for user ' + event.userId,
      module: 'subscription',
    });
  }
}
