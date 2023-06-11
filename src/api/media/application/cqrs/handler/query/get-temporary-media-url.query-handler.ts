import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTemporaryMediaUrlQuery } from '../../query/get-temporary-media-url.query';
import { GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ConfigService } from '@nestjs/config';

@QueryHandler(GetTemporaryMediaUrlQuery)
export class GetTemporaryMediaUrlQueryHandler implements IQueryHandler<GetTemporaryMediaUrlQuery> {
  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {}

  async execute(query: GetTemporaryMediaUrlQuery): Promise<string> {
    if (
      !this.configService.get('AWS_ACCESS_KEY_ID') ||
      !this.configService.get('AWS_SECRET_ACCESS_KEY') ||
      !this.configService.get('AWS_SIGNED_URL_EXPIRATION') ||
      !this.configService.get('AWS_REGION') ||
      !this.configService.get('AWS_PRIVATE_BUCKET_NAME')
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'Media',
          localisation: 'GetTemporaryMediaUrlQueryHandler',
          error:
            'AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY or AWS_SIGNED_URL_EXPIRATION or AWS_REGION or AWS_PRIVATE_BUCKET_NAME is not defined',
        }),
      );
      throw new Error('AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not defined');
    }
    const client: S3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
    });

    const options: GetObjectCommandInput = {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME') ?? '',
      Key: query.mediaKey,
    };

    const command = new GetObjectCommand(options);
    return await getSignedUrl(client, command, {
      expiresIn: this.configService.get('AWS_SIGNED_URL_EXPIRATION') ?? 60,
    });
  }
}
