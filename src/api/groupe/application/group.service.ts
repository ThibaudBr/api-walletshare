import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IsCardOwnerWithUserIdQuery } from '../../card/application/cqrs/query/is-card-owner-with-user-id.query';
import { ErrorUserIsNotOwnerOfCardRuntimeException } from '../../../util/exception/runtime-exception/error-user-is-not-owner-of-card.runtime-exception';
import { RoleGroupMembershipEnum } from '../domain/enum/role-group-membership.enum';
import { IsUserIdHaveRoleInGroupQuery } from './cqrs/query/is-user-id-have-role-in-group.query';
import { ErrorUserHaveNoRightOverGroupRuntimeException } from '../../../util/exception/runtime-exception/error-user-have-no-right-over-group.runtime-exception';
import { CreateGroupRequest } from '../web/request/create-group.request';
import { CreateGroupCommand } from './cqrs/command/create-group.command';
import { DeleteGroupCommand } from './cqrs/command/delete-group.command';
import { SoftDeleteGroupCommand } from './cqrs/command/soft-delete-group.command';
import { GiveAdminRightGroupCommand } from './cqrs/command/give-admin-right-group.command';
import { RemoveAdminRightGroupCommand } from './cqrs/command/remove-admin-right-group.command';
import { GiveAdminRightGroupRequest } from '../web/request/give-admin-right-group.request';
import { RemoveAdminRightGroupRequest } from '../web/request/remove-admin-right-group.request';
import { RemoveCardFromGroupCommand } from './cqrs/command/remove-card-from-group.command';
import { RemoveCardFromGroupRequest } from '../web/request/remove-card-from-group.request';
import { RestoreGroupCommand } from './cqrs/command/restore-group.command';
import { UpdateGroupCommand } from './cqrs/command/update-group.command';
import { UpdateGroupRequest } from '../web/request/update-group.request';
import { GroupResponse } from '../web/response/group.response';
import { GroupEntity } from '../domain/entities/group.entity';
import { GroupMembershipResponse } from '../web/response/group-membership.response';
import { CardResponse } from '../../card/web/response/card.response';
import { DeleteGroupMembershipCommand } from './cqrs/command/delete-group-membership.command';
import { GetGroupByIdQuery } from './cqrs/query/get-group-by-id.query';
import { GetAllGroupQuery } from './cqrs/query/get-all-group.query';
import { GetGroupWithCriteriaRequest } from '../web/request/get-group-with-criteria.request';
import { GetGroupWhereCardIsAdminQuery } from './cqrs/query/get-group-where-card-is-admin.query';
import { GetGroupWithCriteriaQuery } from './cqrs/query/get-group-with-criteria.query';
import { GetGroupWhereUserIdIsMemberQuery } from './cqrs/query/get-group-where-user-id-is-member.query';
import { GetGroupMembershipWithCardIdQuery } from './cqrs/query/get-group-membership-with-card-id.query';
import { AddCardToGroupCommand } from './cqrs/command/add-card-to-group.command';
import { ErrorListOfCardIdIsEmptyRuntimeException } from '../../../util/exception/runtime-exception/error-list-of-card-id-is-empty.runtime-exception';

@Injectable()
export class GroupService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  // get

  async getAllGroups(): Promise<GroupResponse[]> {
    return await this.queryBus.execute(new GetAllGroupQuery()).then((groups: GroupEntity[]) => {
      return groups.map((group: GroupEntity) => {
        return new GroupResponse({
          id: group.id,
          name: group.name,
          groupMemberships: group.members
            ? group.members.map(
                member =>
                  new GroupMembershipResponse({
                    ...member,
                    groupId: group.id,
                    cardId: member.card.id,
                    cardResponse: new CardResponse({
                      ...member.card,
                    }),
                    role: member.role,
                  }),
              )
            : [],
        });
      });
    });
  }

  async getGroupById(groupId: string): Promise<GroupResponse> {
    return await this.queryBus.execute(new GetGroupByIdQuery({ groupId })).then((group: GroupEntity) => {
      return new GroupResponse({
        id: group.id,
        name: group.name,
        groupMemberships: group.members
          ? group.members.map(
              member =>
                new GroupMembershipResponse({
                  ...member,
                  groupId: group.id,
                  cardId: member.card.id,
                  cardResponse: new CardResponse({
                    ...member.card,
                  }),
                  role: member.role,
                }),
            )
          : [],
      });
    });
  }

  async getMyGroup(userId: string, groupId: string): Promise<GroupResponse> {
    return await this.queryBus.execute(new GetGroupByIdQuery({ groupId })).then((group: GroupEntity) => {
      if (!group) {
        throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, groupId);
      }
      return new GroupResponse({
        id: group.id,
        name: group.name,
        groupMemberships: group.members
          ? group.members.map(
              member =>
                new GroupMembershipResponse({
                  ...member,
                  groupId: group.id,
                  cardId: member.card.id,
                  cardResponse: new CardResponse({
                    ...member.card,
                  }),
                  role: member.role,
                }),
            )
          : [],
      });
    });
  }

  async getAllMyGroups(userId: string): Promise<GroupResponse[]> {
    return await this.queryBus
      .execute(new GetGroupWhereUserIdIsMemberQuery({ userId }))
      .then((groups: GroupEntity[]) => {
        return groups.map((group: GroupEntity) => {
          return new GroupResponse({
            id: group.id,
            name: group.name,
            groupMemberships: group.members
              ? group.members.map(
                  member =>
                    new GroupMembershipResponse({
                      ...member,
                      groupId: group.id,
                      cardId: member.card.id,
                      cardResponse: new CardResponse({
                        ...member.card,
                      }),
                      role: member.role,
                    }),
                )
              : [],
          });
        });
      });
  }

  async getGroupWhereUserIdAdmin(userId: string): Promise<GroupResponse[]> {
    return await this.queryBus
      .execute(new GetGroupWhereUserIdIsMemberQuery({ userId: userId }))
      .then((groups: GroupEntity[]) => {
        return groups.map((group: GroupEntity) => {
          return new GroupResponse({
            id: group.id,
            name: group.name,
            groupMemberships: group.members
              ? group.members.map(
                  member =>
                    new GroupMembershipResponse({
                      ...member,
                      groupId: group.id,
                      cardId: member.card.id,
                      cardResponse: new CardResponse({
                        ...member.card,
                      }),
                      role: member.role,
                    }),
                )
              : [],
          });
        });
      });
  }

  async getGroupMemberByGroupIdAdmin(groupId: string): Promise<GroupMembershipResponse[]> {
    return await this.queryBus.execute(new GetGroupByIdQuery({ groupId })).then((group: GroupEntity) => {
      return group.members
        ? group.members.map(
            member =>
              new GroupMembershipResponse({
                ...member,
                groupId: group.id,
                cardId: member.card.id,
                cardResponse: new CardResponse({
                  ...member.card,
                }),
                role: member.role,
              }),
          )
        : [];
    });
  }

  async getGroupMemberByMyGroupId(groupId: string, userId: string): Promise<GroupMembershipResponse[]> {
    if (
      !(await this.isUserIdHaveRoleInGroup(userId, groupId, [
        RoleGroupMembershipEnum.ADMIN,
        RoleGroupMembershipEnum.OWNER,
        RoleGroupMembershipEnum.MEMBER,
      ]))
    ) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, groupId);
    }

    return await this.queryBus.execute(new GetGroupByIdQuery({ groupId })).then((group: GroupEntity) => {
      return group.members
        ? group.members.map(
            member =>
              new GroupMembershipResponse({
                ...member,
                groupId: group.id,
                cardId: member.card.id,
                cardResponse: new CardResponse({
                  ...member.card,
                }),
                role: member.role,
              }),
          )
        : [];
    });
  }

  async getGroupMembershipByMyCardId(cardId: string, userId: string): Promise<GroupMembershipResponse[]> {
    if (!(await this.isCardOwnerWithUserId(userId, cardId))) {
      throw new ErrorUserIsNotOwnerOfCardRuntimeException(userId, cardId);
    }
    return await this.queryBus.execute(new GetGroupMembershipWithCardIdQuery({ cardId })).then((group: GroupEntity) => {
      return group.members
        ? group.members.map(
            member =>
              new GroupMembershipResponse({
                ...member,
                groupId: group.id,
                cardId: member.card.id,
                cardResponse: new CardResponse({
                  ...member.card,
                }),
                role: member.role,
              }),
          )
        : [];
    });
  }

  async getGroupMembershipByCardIdAdmin(cardId: string): Promise<GroupMembershipResponse[]> {
    return await this.queryBus.execute(new GetGroupMembershipWithCardIdQuery({ cardId })).then((group: GroupEntity) => {
      return group.members
        ? group.members.map(
            member =>
              new GroupMembershipResponse({
                ...member,
                groupId: group.id,
                cardId: member.card.id,
                cardResponse: new CardResponse({
                  ...member.card,
                }),
                role: member.role,
              }),
          )
        : [];
    });
  }

  async getGroupWithCriteriaAdmin(getGroupWithCriteriaRequest: GetGroupWithCriteriaRequest): Promise<GroupResponse[]> {
    return await this.queryBus
      .execute(
        new GetGroupWithCriteriaQuery({
          ...getGroupWithCriteriaRequest,
        }),
      )
      .then((groups: GroupEntity[]) => {
        return groups.map((group: GroupEntity) => {
          return new GroupResponse({
            id: group.id,
            name: group.name,
            groupMemberships: group.members
              ? group.members.map(
                  member =>
                    new GroupMembershipResponse({
                      ...member,
                      groupId: group.id,
                      cardId: member.card.id,
                      cardResponse: new CardResponse({
                        ...member.card,
                      }),
                      role: member.role,
                    }),
                )
              : [],
          });
        });
      });
  }

  async getGroupWhereMyCardIsAdminRole(userId: string, cardId: string): Promise<GroupResponse[]> {
    if (!(await this.isCardOwnerWithUserId(userId, cardId))) {
      throw new ErrorUserIsNotOwnerOfCardRuntimeException(userId, cardId);
    }
    return await this.queryBus
      .execute(new GetGroupWhereCardIsAdminQuery({ cardId: cardId }))
      .then((groups: GroupEntity[]) => {
        return groups.map((group: GroupEntity) => {
          return new GroupResponse({
            id: group.id,
            name: group.name,
            groupMemberships: group.members
              ? group.members.map(
                  member =>
                    new GroupMembershipResponse({
                      ...member,
                      groupId: group.id,
                      cardId: member.card.id,
                      cardResponse: new CardResponse({
                        ...member.card,
                      }),
                      role: member.role,
                    }),
                )
              : [],
          });
        });
      });
  }

  async getGroupWhereCardIsAdminRoleAdmin(cardId: string): Promise<GroupResponse[]> {
    return await this.queryBus
      .execute(new GetGroupWhereCardIsAdminQuery({ cardId: cardId }))
      .then((groups: GroupEntity[]) => {
        return groups.map((group: GroupEntity) => {
          return new GroupResponse({
            id: group.id,
            name: group.name,
            groupMemberships: group.members
              ? group.members.map(
                  member =>
                    new GroupMembershipResponse({
                      ...member,
                      groupId: group.id,
                      cardId: member.card.id,
                      cardResponse: new CardResponse({
                        ...member.card,
                      }),
                      role: member.role,
                    }),
                )
              : [],
          });
        });
      });
  }

  async createMyGroup(userId: string, request: CreateGroupRequest): Promise<void> {
    if (!(await this.isCardOwnerWithUserId(userId, request.cardId))) {
      throw new ErrorUserIsNotOwnerOfCardRuntimeException(userId, request.cardId);
    }
    return await this.commandBus.execute(
      new CreateGroupCommand({
        cardId: request.cardId,
        name: request.name,
      }),
    );
  }

  async createGroupAdmin(request: CreateGroupRequest): Promise<void> {
    return await this.commandBus.execute(
      new CreateGroupCommand({
        cardId: request.cardId,
        name: request.name,
      }),
    );
  }

  async deleteGroupAdmin(groupId: string): Promise<void> {
    return await this.commandBus.execute(
      new DeleteGroupCommand({
        groupId: groupId,
      }),
    );
  }

  async giveMyGroupRightToCard(userId: string, giveAdminRightRequest: GiveAdminRightGroupRequest): Promise<void> {
    if (!(await this.isUserIdHaveRoleInGroup(userId, giveAdminRightRequest.groupId, [RoleGroupMembershipEnum.OWNER]))) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, giveAdminRightRequest.groupId);
    }
    return await this.commandBus.execute(
      new GiveAdminRightGroupCommand({
        groupId: giveAdminRightRequest.groupId,
        cardId: giveAdminRightRequest.cardId,
      }),
    );
  }

  async giveGroupRightToCardAdmin(giveAdminRightRequest: GiveAdminRightGroupRequest): Promise<void> {
    return await this.commandBus.execute(
      new GiveAdminRightGroupCommand({
        groupId: giveAdminRightRequest.groupId,
        cardId: giveAdminRightRequest.cardId,
      }),
    );
  }

  async removeMyGroupRightToCard(userId: string, removeAdminRightRequest: RemoveAdminRightGroupRequest): Promise<void> {
    if (
      !(await this.isUserIdHaveRoleInGroup(userId, removeAdminRightRequest.groupId, [RoleGroupMembershipEnum.OWNER]))
    ) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, removeAdminRightRequest.groupId);
    }
    return await this.commandBus.execute(
      new RemoveAdminRightGroupCommand({
        groupId: removeAdminRightRequest.groupId,
        cardId: removeAdminRightRequest.cardId,
      }),
    );
  }

  async removeGroupRightToCardAdmin(removeAdminRightRequest: RemoveAdminRightGroupRequest): Promise<void> {
    return await this.commandBus.execute(
      new RemoveAdminRightGroupCommand({
        groupId: removeAdminRightRequest.groupId,
        cardId: removeAdminRightRequest.cardId,
      }),
    );
  }

  async removeCardFromMyGroup(userId: string, removeCardFromGroupRequest: RemoveCardFromGroupRequest): Promise<void> {
    if (
      !(await this.isUserIdHaveRoleInGroup(userId, removeCardFromGroupRequest.groupId, [
        RoleGroupMembershipEnum.OWNER,
        RoleGroupMembershipEnum.ADMIN,
      ]))
    ) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, removeCardFromGroupRequest.groupId);
    }
    return await this.commandBus.execute(
      new RemoveCardFromGroupCommand({
        groupId: removeCardFromGroupRequest.groupId,
        cardId: removeCardFromGroupRequest.cardId,
      }),
    );
  }

  async leaveGroup(userId: string, removeCardFromGroupRequest: RemoveCardFromGroupRequest): Promise<void> {
    if (!(await this.isCardOwnerWithUserId(userId, removeCardFromGroupRequest.cardId))) {
      throw new ErrorUserIsNotOwnerOfCardRuntimeException(userId, removeCardFromGroupRequest.cardId);
    }
    return await this.commandBus.execute(
      new RemoveCardFromGroupCommand({
        groupId: removeCardFromGroupRequest.groupId,
        cardId: removeCardFromGroupRequest.cardId,
      }),
    );
  }

  async removeCardFromGroupAdmin(removeCardFromGroupRequest: RemoveCardFromGroupRequest): Promise<void> {
    return await this.commandBus.execute(
      new RemoveCardFromGroupCommand({
        groupId: removeCardFromGroupRequest.groupId,
        cardId: removeCardFromGroupRequest.cardId,
      }),
    );
  }

  async restoreGroupAdmin(groupId: string): Promise<void> {
    return await this.commandBus.execute(
      new RestoreGroupCommand({
        groupId: groupId,
      }),
    );
  }

  async softDeleteMyGroup(userId: string, groupId: string): Promise<void> {
    if (!(await this.isUserIdHaveRoleInGroup(userId, groupId, [RoleGroupMembershipEnum.OWNER]))) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, groupId);
    }
    return await this.commandBus.execute(
      new SoftDeleteGroupCommand({
        groupId: groupId,
      }),
    );
  }

  async softDeleteGroupAdmin(groupId: string): Promise<void> {
    return await this.commandBus.execute(
      new SoftDeleteGroupCommand({
        groupId: groupId,
      }),
    );
  }

  async updateMyGroup(userId: string, groupId: string, updateGroupRequest: UpdateGroupRequest): Promise<void> {
    if (!(await this.isUserIdHaveRoleInGroup(userId, groupId, [RoleGroupMembershipEnum.OWNER]))) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, groupId);
    }
    return await this.commandBus.execute(
      new UpdateGroupCommand({
        groupId: groupId,
        name: updateGroupRequest.name,
      }),
    );
  }

  async updateGroupAdmin(groupId: string, updateGroupRequest: UpdateGroupRequest): Promise<void> {
    return await this.commandBus.execute(
      new UpdateGroupCommand({
        groupId: groupId,
        name: updateGroupRequest.name,
      }),
    );
  }

  async isCardOwnerWithUserId(userId: string, cardId: string): Promise<boolean> {
    return await this.queryBus.execute(
      new IsCardOwnerWithUserIdQuery({
        userId: userId,
        cardId: cardId,
      }),
    );
  }

  async isUserIdHaveRoleInGroup(userId: string, groupId: string, roles: RoleGroupMembershipEnum[]): Promise<boolean> {
    return await this.queryBus.execute(
      new IsUserIdHaveRoleInGroupQuery({
        userId: userId,
        groupId: groupId,
        roles: roles,
      }),
    );
  }

  async deleteGroupMembershipAdmin(groupMembershipId: string): Promise<void> {
    return await this.commandBus.execute(
      new DeleteGroupMembershipCommand({
        groupMembershipId: groupMembershipId,
      }),
    );
  }

  async addCardToMyGroup(userId: string, groupId: string, cardIdList: string[]): Promise<void> {
    if (
      !(await this.isUserIdHaveRoleInGroup(userId, groupId, [
        RoleGroupMembershipEnum.OWNER,
        RoleGroupMembershipEnum.ADMIN,
      ]))
    ) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, groupId);
    }

    if (!cardIdList.length) {
      throw new ErrorListOfCardIdIsEmptyRuntimeException();
    }

    for (const cardId of cardIdList) {
      await this.commandBus.execute(
        new AddCardToGroupCommand({
          groupId: groupId,
          cardId: cardId,
        }),
      );
    }
  }

  async addCardToGroupAdmin(groupId: string, cardIdList: string[]): Promise<void> {
    if (!cardIdList.length) {
      throw new ErrorListOfCardIdIsEmptyRuntimeException();
    }

    for (const cardId of cardIdList) {
      await this.commandBus.execute(
        new AddCardToGroupCommand({
          groupId: groupId,
          cardId: cardId,
        }),
      );
    }
  }
}
