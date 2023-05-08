import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTemporaryMediaUrlQuery } from '../../query/get-temporary-media-url.query';
import { S3 } from 'aws-sdk';

@QueryHandler(GetTemporaryMediaUrlQuery)
export class GetTemporaryMediaUrlQueryHandler implements IQueryHandler<GetTemporaryMediaUrlQuery> {
  async execute(query: GetTemporaryMediaUrlQuery): Promise<string> {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
      Expires: Number(process.env.AWS_SIGNED_URL_EXPIRATION),
      Key: query.mediaKey,
    });
  }
}
