import {EventBus, IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {SubscriptionEntity} from "../../../../domain/entities/subscription.entity";
import {StatusSubscriptionEnum} from "../../../../domain/enum/status-subscription.enum";
import {ErrorCustomEvent} from "../../../../../../../util/exception/error-handler/error-custom.event";
import {GetAllActiveSubscriptionQuery} from "../../query/get-all-active-subscription.query";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@QueryHandler(GetAllActiveSubscriptionQuery)
export class GetAllActiveSubscriptionQueryHandler implements IQueryHandler<GetAllActiveSubscriptionQuery> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllActiveSubscriptionQuery): Promise<number> {
    const subscriptions: SubscriptionEntity[] = await this.subscriptionRepository.find({
      where: {
        status: StatusSubscriptionEnum.ACTIVE,
      },
    }).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SubscriptionService',
          error: error.message,
          localisation: 'stripe.subscriptions.list',
        }),
      );
      throw new Error('Error while getting subscription');
    });

    return subscriptions.length;
  }
}
