import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateStripeCustomerCommand } from '../../command/create-stripe-customer.command';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { CreateStripeCustomerEvent } from '../../event/create-stripe-customer.event';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CreateStripeCustomerCommand)
export class CreateStripeCustomerCommandHandler implements ICommandHandler<CreateStripeCustomerCommand> {
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
    private readonly configService: ConfigService,
  ) {
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

  async execute(command: CreateStripeCustomerCommand): Promise<string> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'CreateStripCustomerCommandHandler', error: error }),
        );
        throw new Error('User not found');
      });

    const stripCustomer: Stripe.Response<Stripe.Customer> = await this.stripe.customers
      .create({
        name: command.username,
        email: command.email,
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'CreateStripCustomerCommandHandler', error: error }),
        );
        throw new Error('Error during the creation of the customer');
      });

    user.stripeCustomerId = stripCustomer.id;
    await this.userRepository.save(user).catch(error => {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'payment', handler: 'CreateStripCustomerCommandHandler', error: error }),
      );
      throw new Error('Error during the save of the user');
    });
    await this.eventBus.publish(
      new CreateStripeCustomerEvent({
        userId: user.id,
        username: user.username,
        email: user.mail,
        stripeCustomerId: user.stripeCustomerId,
      }),
    );
    return stripCustomer.id;
  }
}
