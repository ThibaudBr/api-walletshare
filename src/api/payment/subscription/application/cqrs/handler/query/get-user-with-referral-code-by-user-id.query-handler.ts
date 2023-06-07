import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { GetUserWithReferralCodeByUserIdQuery } from '../../query/get-user-with-referral-code-by-user-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetUserWithReferralCodeByUserIdQuery)
export class GetUserWithReferralCodeByUserIdQueryHandler
  implements IQueryHandler<GetUserWithReferralCodeByUserIdQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetUserWithReferralCodeByUserIdQuery): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail({
      where: {
        id: query.userId,
      },
      relations: ['referralCode', 'usedReferralCode'],
    });
  }
}
