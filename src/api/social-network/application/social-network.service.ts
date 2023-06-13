import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSocialNetworkRequest } from '../web/request/create-social-network.request';
import { CreateSocialNetworkCommand } from './cqrs/command/create-social-network.command';
import { UpdateSocialNetworkRequest } from '../web/request/update-social-network.request';
import { GetSocialNetworkWithCriteriaQuery } from './cqrs/query/get-social-network-with-criteria.query';
import { DeleteSocialNetworkCommand } from './cqrs/command/delete-social-network.command';
import { GetAllSocialNetworkQuery } from './cqrs/query/get-all-social-network.query';
import { GetSocialNetworkWithCriteriaRequest } from '../web/request/get-social-network-with-criteria.request';
import { QueryErrorHttpException } from '../../../util/exception/custom-http-exception/query-error.http-exception';
import { RestoreSocialNetworkCommand } from './cqrs/command/restore-social-network.command';
import { SocialNetworkDto } from '../domain/dto/social-network.dto';
import { SocialNetworkResponse } from '../web/response/social-network.response';
import { UpdateSocialNetworkCommand } from './cqrs/command/update-social-network.command';
import { GetSocialNetworkByIdQuery } from './cqrs/query/get-social-network-by-id.query';
import { EntityCreationHttpException } from '../../../util/exception/custom-http-exception/entity-creation.http-exception';
import { DuplicateNameHttpException } from '../../../util/exception/custom-http-exception/duplicate-name.http-exception';
import { CommandErrorHttpException } from '../../../util/exception/custom-http-exception/command-error.http-exception';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { InvalidParameterEntityHttpException } from '../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { EntityIsNotSoftDeletedHttpException } from '../../../util/exception/custom-http-exception/entity-is-not-soft-deleted.http-exception';

@Injectable()
export class SocialNetworkService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async getAllSocialNetwork(): Promise<SocialNetworkResponse[]> {
    try {
      return await this.queryBus
        .execute(new GetAllSocialNetworkQuery())
        .then((socialNetworksDto: SocialNetworkDto[]) => {
          return socialNetworksDto.map(socialNetworkDto => {
            return new SocialNetworkResponse(socialNetworkDto);
          });
        });
    } catch (error) {
      throw new QueryErrorHttpException();
    }
  }

  async getSocialNetworkById(socialNetworkId: string): Promise<SocialNetworkResponse> {
    try {
      return await this.queryBus
        .execute(new GetSocialNetworkByIdQuery({ id: socialNetworkId }))
        .then((socialNetworkDto: SocialNetworkDto) => {
          return new SocialNetworkResponse(socialNetworkDto);
        });
    } catch (error) {
      if (error.message === 'SocialNetwork not found') throw new InvalidIdHttpException();
      else throw new QueryErrorHttpException();
    }
  }

  async getSocialNetworkWithCriteria(criteria: GetSocialNetworkWithCriteriaRequest): Promise<SocialNetworkResponse[]> {
    try {
      return await this.queryBus
        .execute(
          new GetSocialNetworkWithCriteriaQuery({
            name: criteria.name,
            isDeleted: criteria.isDeleted,
          }),
        )
        .then((socialNetworksDto: SocialNetworkDto[]) => {
          return socialNetworksDto.map(socialNetworkDto => {
            return new SocialNetworkResponse(socialNetworkDto);
          });
        });
    } catch (error) {
      throw new QueryErrorHttpException();
    }
  }

  async createSocialNetwork(socialNetworkRequest: CreateSocialNetworkRequest): Promise<void> {
    try {
      return await this.commandBus.execute(
        new CreateSocialNetworkCommand({
          name: socialNetworkRequest.name,
          url: socialNetworkRequest.url,
          icon: socialNetworkRequest.icon,
          color: socialNetworkRequest.color,
        }),
      );
    } catch (error) {
      if (error.message === 'Duplicated name') throw new DuplicateNameHttpException();
      else if (error instanceof Array) throw new InvalidParameterEntityHttpException(error);
      else if (error.message === 'SocialNetwork not created') throw new EntityCreationHttpException();
      else throw new CommandErrorHttpException();
    }
  }

  async updateSocialNetwork(socialNetworkId: string, socialNetworkRequest: UpdateSocialNetworkRequest): Promise<void> {
    try {
      return await this.commandBus.execute(
        new UpdateSocialNetworkCommand({
          color: socialNetworkRequest.color,
          icon: socialNetworkRequest.icon,
          url: socialNetworkRequest.url,
          name: socialNetworkRequest.name,
          id: socialNetworkId,
        }),
      );
    } catch (error) {
      if (error.message === 'SocialNetwork not found') throw new InvalidIdHttpException();
      if (error.message === 'Duplicated name') throw new DuplicateNameHttpException();
      if (error.message === 'Social network is not soft deleted')
        throw new EntityIsNotSoftDeletedHttpException('Social network is not soft deleted');
      if (error instanceof Array) throw new InvalidParameterEntityHttpException(error);
      else throw new CommandErrorHttpException();
    }
  }

  async deleteSocialNetwork(socialNetworkId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new DeleteSocialNetworkCommand({
          id: socialNetworkId,
        }),
      );
    } catch (error) {
      if (error.message === 'SocialNetwork not found') throw new InvalidIdHttpException();
      else throw new CommandErrorHttpException();
    }
  }

  async restoreSocialNetwork(socialNetworkId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new RestoreSocialNetworkCommand({
          id: socialNetworkId,
        }),
      );
    } catch (error) {
      if (error.message === 'SocialNetwork not found') throw new InvalidIdHttpException();
      if (error.message === 'Social network is not soft deleted')
        throw new EntityIsNotSoftDeletedHttpException(error.message);
      if (error.message === 'SocialNetwork not restored') throw new CommandErrorHttpException();
      throw new InternalServerErrorException(error.message);
    }
  }
}
