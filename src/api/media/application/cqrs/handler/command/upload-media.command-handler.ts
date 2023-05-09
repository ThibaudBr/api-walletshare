import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UploadMediaCommand } from '../../command/upload-media.command';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { UploadMediaEvent } from '../../event/upload-media.event';
import * as process from 'process';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UploadMediaCommand)
export class UploadMediaCommandHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UploadMediaCommand): Promise<MediaEntity> {
    const s3: S3 = new S3();
    if (!process.env.AWS_PRIVATE_BUCKET_NAME) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'UploadMediaCommandHandler',
          localisation: 'Process.env.AWS_PRIVATE_BUCKET_NAME',
          error: 'Process.env.AWS_PRIVATE_BUCKET_NAME is not defined',
        }),
      );
      throw new Error('Process.env.AWS_PRIVATE_BUCKET_NAME is not defined');
    }
    if (command.dataBuffer.length > Number(process.env.AWS_MAX_FILE_SIZE_MB) || 1.5 * 1024 * 1024) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'UploadMediaCommandHandler',
          localisation: 'command.dataBuffer.length',
          error: 'File is too big',
        }),
      );
      throw new Error('File is too big');
    }
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
        Body: command.dataBuffer,
        Key: `${uuid()}-${command.filename.replace(' ', '-')}`,
      })
      .promise()
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UploadMediaCommandHandler',
            localisation: 's3.upload',
            error: error,
          }),
        );
        throw new Error('Error while uploading file to S3');
      });

    const newMedia: MediaEntity = this.mediaRepository.create({
      key: uploadResult.Key,
    });
    const savedMedia: MediaEntity = await this.mediaRepository.save(newMedia);
    await this.eventBus.publish(
      new UploadMediaEvent({
        id: savedMedia.id,
        url: uploadResult.Location,
        key: uploadResult.Key,
      }),
    );
    return savedMedia;
  }
}