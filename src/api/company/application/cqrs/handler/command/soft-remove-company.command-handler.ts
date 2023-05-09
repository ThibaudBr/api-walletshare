import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemoveCompanyCommand } from '../../command/soft-remove-company.command';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';

@CommandHandler(SoftRemoveCompanyCommand)
export class SoftRemoveCompanyCommandHandler implements ICommandHandler<SoftRemoveCompanyCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemoveCompanyCommand): Promise<void> {
    const companyToRemove: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'SoftRemoveCompanyCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    await this.companyRepository.softRemove(companyToRemove);
    await this.eventBus.publish(
      new SoftRemoveCompanyCommand({
        companyId: command.companyId,
      }),
    );
  }
}
