import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddAvatarCompanyMediaCommand } from '../../command/add-avatar-company-media.command';
import { CompanyEntity } from '../../../../../company/domain/entities/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { AddAvatarCompanyMediaEvent } from '../../event/add-avatar-company-media.event';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';

@CommandHandler(AddAvatarCompanyMediaCommand)
export class AddAvatarCompanyMediaCommandHandler implements ICommandHandler<AddAvatarCompanyMediaCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AddAvatarCompanyMediaCommand): Promise<void> {
    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: ['avatarMedia'],
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddAvatarCompanyMediaCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Company not found');
      });

    if (company.avatarMedia) {
      await this.commandBus.execute(
        new SoftRemoveMediaCommand({
          mediaId: company.avatarMedia.id,
        }),
      );
    }

    company.avatarMedia = command.mediaEntity;
    await this.companyRepository.save(company).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddAvatarCompanyMediaCommandHandler',
          localisation: 'CompanyRepository.save',
          error: error,
        }),
      );
      throw new Error('Company not saved');
    });
    await this.eventBus.publish(
      new AddAvatarCompanyMediaEvent({
        companyId: company.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}
