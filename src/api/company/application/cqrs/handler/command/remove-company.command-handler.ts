import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCompanyCommand } from '../../command/remove-company.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveCompanyCommand)
export class RemoveCompanyCommandHandler implements ICommandHandler<RemoveCompanyCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveCompanyCommand): Promise<void> {
    const companyToRemove = await this.companyRepository
      .findOneOrFail({
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'RemoveCompanyCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    await this.companyRepository.remove(companyToRemove);
    await this.eventBus.publish(
      new RemoveCompanyCommand({
        companyId: command.companyId,
      }),
    );
  }
}
