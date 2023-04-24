import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../../../src/api/groupe/domain/entities/group.entity';
import { Repository } from 'typeorm';
import { GroupMembershipEntity } from '../../../src/api/groupe/domain/entities/group-membership.entity';
import { CardEntity } from '../../../src/api/card/domain/entities/card.entity';
import { CreateGroupRequest } from '../../../src/api/groupe/web/request/create-group.request';
import { RoleGroupMembershipEnum } from '../../../src/api/groupe/domain/enum/role-group-membership.enum';

@Injectable()
export class GroupTestE2eService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}

  async createGroupTest(createGroupRequest: CreateGroupRequest): Promise<GroupEntity> {
    try {
      const card = await this.cardRepository.findOneOrFail({
        withDeleted: true,
        where: {
          id: createGroupRequest.cardId,
        },
      });
      const members = [
        new GroupMembershipEntity({
          role: RoleGroupMembershipEnum.OWNER,
          card: card,
        }),
      ];
      const newGroup = new GroupEntity({
        name: createGroupRequest.name,
        members: members,
      });

      return await this.groupRepository.save(newGroup);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async removeGroup(groupId: string): Promise<void> {
    const groupToDelete = await this.groupRepository.findOneOrFail({
      where: {
        id: groupId
      }
    })
    await this.groupRepository.softRemove(groupToDelete);
  }

  async getGroup(groupId: string): Promise<GroupEntity> {
    return await this.groupRepository.findOneOrFail({
      withDeleted: true,
      relations: ['members', 'members.card'],
      where: {
        id: groupId,
      },
    });
  }

  async getAllGroup(): Promise<GroupEntity[]> {
    return await this.groupRepository.find({
      relations: ['members', 'members.card'],
      withDeleted: true,
    });
  }

  async addGroupMembership(
    groupId: string,
    cardId: string,
    role: RoleGroupMembershipEnum,
  ): Promise<GroupMembershipEntity> {
    const card: CardEntity = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: cardId,
      },
    });

    const group: GroupEntity = await this.groupRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: groupId,
      },
    });

    const newGroupMembership: GroupMembershipEntity = new GroupMembershipEntity({
      role: role,
      card: card,
      group: group,
    });

    return this.groupMembershipRepository.save(newGroupMembership);
  }

  async removeGroupMembership(groupMembershipId: string): Promise<void> {
    const groupMembershipToDelete = await this.groupMembershipRepository.findOneOrFail({
      where: {
        id: groupMembershipId
      }
    })
    await this.groupMembershipRepository.softRemove(groupMembershipToDelete);
  }
}
