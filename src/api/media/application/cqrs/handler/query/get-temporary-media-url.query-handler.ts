import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTemporaryMediaUrlQuery } from '../../query/get-temporary-media-url.query';
import { GetObjectCommand, GetObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetTemporaryMediaUrlQuery)
export class GetTemporaryMediaUrlQueryHandler implements IQueryHandler<GetTemporaryMediaUrlQuery> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(query: GetTemporaryMediaUrlQuery): Promise<string> {
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_SIGNED_URL_EXPIRATION ||
      !process.env.AWS_REGION ||
      !process.env.AWS_PRIVATE_BUCKET_NAME
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
    const s3: S3 = new S3({
      region: process.env.AWS_REGION,
    });

    const options: GetObjectCommandInput = {
      Bucket: process.env.AWS_PRIVATE_BUCKET_NAME || '',
      Key: query.mediaKey,
    };

    const command = new GetObjectCommand(options);
    return await getSignedUrl(s3, command, { expiresIn: Number(process.env.AWS_SIGNED_URL_EXPIRATION) || 60 });
  }
}
