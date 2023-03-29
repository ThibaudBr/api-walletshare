import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProfilesByUserIdQuery } from "../../query/get-profiles-by-user-id.query";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../../../user/domain/entities/user.entity";
import { ProfileResponse } from "../../../domain/response/profile.response";
import { Repository } from "typeorm";
import { ProfileEntity } from "../../../domain/entities/profile.entity";

@QueryHandler(GetProfilesByUserIdQuery)
export class GetProfilesByUserIdQueryHandler implements IQueryHandler<GetProfilesByUserIdQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetProfilesByUserIdQuery): Promise<ProfileResponse[]> {
    try {
      const user = await this.userRepository
        .findOneOrFail({
          where: [{ id: query.id }],
          relations: ['profile'],
        })
        .catch(() => {
          throw new Error('User not found');
        });

      return user.profiles.map(profile => {
        return new ProfileResponse({
          ...profile,
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
