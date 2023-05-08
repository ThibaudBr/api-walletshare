import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddBannerCompanyMediaCommand } from '../../command/add-banner-company-media.command';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../../company/domain/entities/company.entity';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { AddBannerCompanyMediaEvent } from '../../event/add-banner-company-media.event';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';

@CommandHandler(AddBannerCompanyMediaCommand)
export class AddBannerCompanyMediaCommandHandler implements ICommandHandler<AddBannerCompanyMediaCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AddBannerCompanyMediaCommand): Promise<void> {
    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: ['bannerMedia'],
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddBannerCompanyMediaCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Company not found');
      });

    if (company.bannerMedia) {
      await this.commandBus.execute(
        new SoftRemoveMediaCommand({
          mediaId: company.bannerMedia.id,
        }),
      );
    }

    company.bannerMedia = command.mediaEntity;
    await this.companyRepository.save(company).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddBannerCompanyMediaCommandHandler',
          localisation: 'CompanyRepository.save',
          error: error,
        }),
      );
    });
    await this.eventBus.publish(
      new AddBannerCompanyMediaEvent({
        companyId: company.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}
