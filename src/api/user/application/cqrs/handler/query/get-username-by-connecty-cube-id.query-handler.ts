import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsernameByConnectyCubeIdQuery } from '../../query/get-username-by-connecty-cube-id.query';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { RoleProfileEnum } from '../../../../../profile/domain/enum/role-profile.enum';

@QueryHandler(GetUsernameByConnectyCubeIdQuery)
export class GetUsernameByConnectyCubeIdQueryHandler implements IQueryHandler<GetUsernameByConnectyCubeIdQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetUsernameByConnectyCubeIdQuery): Promise<string> {
    return await this.userRepository
      .findOneOrFail({
        relations: ['profiles'],
        where: { connectyCubeId: query.connectyCubeId },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetUsernameByConnectyCubeIdQueryHandler',
            localisation: 'userRepository.findOneOrFail',
            error: error.message,
          }),
        );
        return 'Someone is calling you';
      })
      .then((user: UserEntity): string => {
        for (const profile of user.profiles) {
          if (profile.roleProfile === RoleProfileEnum.COMPANY || profile.roleProfile === RoleProfileEnum.PREMIUM) {
            return profile.usernameProfile;
          }
        }
        return 'Someone is calling you';
      });
  }
}
