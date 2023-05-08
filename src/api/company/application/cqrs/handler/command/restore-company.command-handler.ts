import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreCompanyEvent } from '../../event/restore-company.event';
import { RestoreCompanyCommand } from '../../command/restore-company.command';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';

@CommandHandler(RestoreCompanyEvent)
export class RestoreCompanyCommandHandler implements ICommandHandler<RestoreCompanyCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreCompanyCommand): Promise<void> {
    const companyToRestore: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        where: {
          id: command.companyId,
        },
        withDeleted: true,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'RestoreCompanyCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });
    await this.companyRepository.restore(companyToRestore.id);
    await this.eventBus.publish(
      new RestoreCompanyCommand({
        companyId: command.companyId,
      }),
    );
  }
}
