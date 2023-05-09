import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllOccupationQuery } from './cqrs/query/get-all-occupation.query';
import { QueryErrorHttpException } from '../../../util/exception/custom-http-exception/query-error.http-exception';
import { OccupationDto } from '../domain/dto/occupation.dto';
import { OccupationResponse } from '../web/response/occupation-response';
import { OccupationNotFoundHttpException } from '../../../util/exception/custom-http-exception/occupation-not-found.http-exception';
import { GetOccupationByIdQuery } from './cqrs/query/get-occupation-by-id.query';
import { GetOccupationWithCriteriaRequest } from '../web/request/get-occupation-with-criteria.request';
import { GetOccupationWithCriteriaQuery } from './cqrs/query/get-occupation-with-criteria.query';
import { GetOccupationWithCriteriaDto } from '../domain/dto/get-occupation-with-criteria.dto';
import { CreateOccupationCommand } from './cqrs/command/create-occupation.command';
import { CreateOccupationDto } from '../domain/dto/create-occupation.dto';
import { InvalidClassException } from '@nestjs/core/errors/exceptions/invalid-class.exception';
import { DuplicateNameHttpException } from '../../../util/exception/custom-http-exception/duplicate-name.http-exception';
import { CreateOccupationRequest } from '../web/request/create-occupation.request';
import { UpdateOccupationRequest } from '../web/request/update-occupation.request';
import { UpdateOccupationDto } from '../domain/dto/update-occupation.dto';
import { UpdateOccupationCommand } from './cqrs/command/update-occupation.command';
import { DeleteOccupationCommand } from './cqrs/command/delete-occupation.command';
import { SoftDeleteOccupationCommand } from './cqrs/command/soft-delete-occupation.command';
import { RestoreOccupationCommand } from './cqrs/command/restore-occupation.command';
import { InvalidParameterEntityHttpException } from '../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { EntityIsNotSoftDeletedHttpException } from '../../../util/exception/custom-http-exception/entity-is-not-soft-deleted.http-exception';

@Injectable()
export class OccupationService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async getAllOccupation(): Promise<OccupationResponse[]> {
    try {
      return await this.queryBus.execute(new GetAllOccupationQuery({})).then((occupationsDto: OccupationDto[]) => {
        return occupationsDto.map(occupationDto => {
          return new OccupationResponse(occupationDto);
        });
      });
    } catch (error) {
      throw new QueryErrorHttpException();
    }
  }

  async getOccupationById(occupationId: string): Promise<OccupationResponse> {
    try {
      return await this.queryBus
        .execute(new GetOccupationByIdQuery({ occupationId: occupationId }))
        .then((occupationDto: OccupationDto) => {
          return new OccupationResponse(occupationDto);
        });
    } catch (error) {
      if (error.message === 'Occupation not found') throw new OccupationNotFoundHttpException();
      else throw new QueryErrorHttpException();
    }
  }

  async getOccupationWithCriteria(criteria: GetOccupationWithCriteriaRequest): Promise<OccupationResponse[]> {
    try {
      return await this.queryBus
        .execute(
          new GetOccupationWithCriteriaQuery({
            criteria: new GetOccupationWithCriteriaDto({
              name: criteria.name,
              isDeleted: criteria.isDeleted,
            }),
          }),
        )
        .then((occupationsDto: OccupationDto[]) => {
          return occupationsDto.map(occupationDto => {
            return new OccupationResponse(occupationDto);
          });
        });
    } catch (error) {
      throw new QueryErrorHttpException();
    }
  }

  async createOccupation(occupationRequest: CreateOccupationRequest): Promise<void> {
    try {
      return await this.commandBus.execute(
        new CreateOccupationCommand({
          createOccupationDto: new CreateOccupationDto({
            name: occupationRequest.name,
          }),
        }),
      );
    } catch (error) {
      if (error.message == 'Duplicated name') throw new DuplicateNameHttpException();
      else if (error instanceof Array) throw new InvalidParameterEntityHttpException(error);
      else throw error;
    }
  }

  async updateOccupation(occupationId: string, occupationRequest: UpdateOccupationRequest): Promise<void> {
    try {
      return await this.commandBus.execute(
        new UpdateOccupationCommand({
          occupationId: occupationId,
          updateOccupationDto: new UpdateOccupationDto({
            name: occupationRequest.name,
          }),
        }),
      );
    } catch (error) {
      if (error.message === 'Occupation not found') throw new OccupationNotFoundHttpException();
      else if (error.message === 'Duplicated name') throw new DuplicateNameHttpException();
      else if (error instanceof Array) throw new InvalidParameterEntityHttpException(error);
      else throw error;
    }
  }

  async deleteOccupation(occupationId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new DeleteOccupationCommand({
          occupationId: occupationId,
        }),
      );
    } catch (error) {
      if (error.message === 'Occupation not found') throw new OccupationNotFoundHttpException();
      else if (error instanceof InvalidClassException) throw error;
      else throw error;
    }
  }

  async softDeleteOccupation(occupationId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new SoftDeleteOccupationCommand({
          occupationId: occupationId,
        }),
      );
    } catch (error) {
      if (error.message === 'Occupation not found') throw new OccupationNotFoundHttpException();
      else if (error instanceof InvalidClassException) throw error;
      else throw error;
    }
  }

  async restoreOccupation(occupationId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new RestoreOccupationCommand({
          occupationId: occupationId,
        }),
      );
    } catch (error) {
      if (error.message === 'Occupation not found') throw new OccupationNotFoundHttpException();
      if (error.message === 'Occupation is not soft deleted')
        throw new EntityIsNotSoftDeletedHttpException(error.message);
      else if (error instanceof InvalidClassException) throw error;
      else throw error;
    }
  }
}