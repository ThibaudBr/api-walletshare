import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateCardPresetCommand } from '../../command/create-card-preset.command';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { validate, ValidationError } from 'class-validator';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { CreateCardPresetEvent } from '../../event/create-card-preset.event';

@CommandHandler(CreateCardPresetCommand)
export class CreateCardPresetCommandHandler implements ICommandHandler<CreateCardPresetCommand> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateCardPresetCommand): Promise<void> {
    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        relations: ['cardPresets'],
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'CreateCardPresetCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    const cardPreset: CardPresetEntity = new CardPresetEntity({
      company: company,
      alignment: command.alignment,
      backgroundColor: command.backgroundColor,
    });

    const errors: ValidationError[] = await validate(cardPreset);
    if (errors.length > 0) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: errors.map(error => error.constraints).toString(),
          handler: 'CreateCardPresetCommandHandler',
          localisation: 'validate',
        }),
      );
      throw new Error('Card preset is not valid');
    }

    await this.cardPresetRepository.save(cardPreset).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'CreateCardPresetCommandHandler',
          localisation: 'cardPresetRepository.save',
        }),
      );
      throw new Error('Card preset not created');
    });

    await this.eventBus.publish(
      new CreateCardPresetEvent({
        companyId: command.companyId,
        id: cardPreset.id,
      }),
    );
  }
}
