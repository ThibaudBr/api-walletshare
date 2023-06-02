import {EventBus, IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import Stripe from "stripe";
import {ConfigService} from "@nestjs/config";
import {ErrorCustomEvent} from "../../../../../../../util/exception/error-handler/error-custom.event";
import {GetProductStripeByIdQuery} from "../../query/get-product-stripe-by-id.query";

@QueryHandler(GetProductStripeByIdQuery)
export class GetProductStripeByIdQueryHandler implements IQueryHandler<GetProductStripeByIdQuery> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') || 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') || 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  async execute(query: GetProductStripeByIdQuery): Promise<Stripe.Response<Stripe.Product>> {
    return await this.stripe.products.retrieve(query.id).catch(error => {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'payment', handler: 'GetProductStripByIdQueryHandler', error: error }),
      );
      throw new Error('Error during the listing of the products');
    });
  }

}
