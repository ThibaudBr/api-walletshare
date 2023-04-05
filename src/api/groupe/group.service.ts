import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AcceptGroupRequestRequest } from './web/request/accept-group-request.request';
import { IsCardOwnerWithUserIdQuery } from '../card/cqrs/query/is-card-owner-with-user-id.query';
import { AcceptGroupRequestCommand } from './cqrs/command/accept-group-request.command';
import { ErrorUserIsNotOwnerOfCardRuntimeException } from '../../util/exception/runtime-exception/error-user-is-not-owner-of-card.runtime-exception';
import { CancelGroupRequestCommand } from './cqrs/command/cancel-group-request.command';
import { GroupRequestStatusEnum } from './domain/enum/group-request-status.enum';
import { RoleGroupMembershipEnum } from './domain/enum/role-group-membership.enum';
import { IsUserIdHaveRoleInGroupQuery } from './cqrs/query/is-user-id-have-role-in-group.query';
import { ErrorUserHaveNoRightOverGroupRuntimeException } from '../../util/exception/runtime-exception/error-user-have-no-right-over-group.runtime-exception';
import { CreateGroupRequest } from './web/request/create-group.request';
import { CreateGroupCommand } from './cqrs/command/create-group.command';
import { DeleteGroupCommand } from './cqrs/command/delete-group.command';
import { SoftDeleteGroupCommand } from './cqrs/command/soft-delete-group.command';
import { GiveAdminRightGroupCommand } from './cqrs/command/give-admin-right-group.command';
import { RemoveAdminRightGroupCommand } from './cqrs/command/remove-admin-right-group.command';
import { GiveAdminRightGroupRequest } from './web/request/give-admin-right-group.request';
import { RemoveAdminRightGroupRequest } from './web/request/remove-admin-right-group.request';
import { RemoveCardFromGroupCommand } from './cqrs/command/remove-card-from-group.command';
import { RemoveCardFromGroupRequest } from './web/request/remove-card-from-group.request';
import { RestoreGroupCommand } from './cqrs/command/restore-group.command';
import { UpdateGroupCommand } from './cqrs/command/update-group.command';
import { UpdateGroupRequest } from './web/request/update-group.request';
import { SendGroupRequestCommand } from './cqrs/command/send-group-request.command';
import { SendGroupRequestRequest } from './web/request/send-group-request.request';
import { GroupResponse } from './web/response/group.response';
import { GetAllGroupQuery } from './cqrs/query/get-all-group.query';
import { GroupEntity } from './domain/entities/group.entity';
import { GroupMembershipResponse } from './web/response/group-membership.response';
import { CardResponse } from '../card/web/response/card.response';
import { GetGroupByIdQuery } from './cqrs/query/get-group-by-id.query';
import { GetGroupMembershipWithCardIdQuery } from './cqrs/query/get-group-membership-with-card-id.query';
import { GetGroupWithCardIdAndGroupIdRequest } from './web/request/get-group-with-card-id-and-group-id.request';
import { GetGroupRequestWithCardIdAndGroupIdQuery } from './cqrs/query/get-group-request-with-card-id-and-group-id.query';
import { GetGroupRequestWithCriteriaQuery } from './cqrs/query/get-group-request-with-criteria.query';
import { GetGroupRequestWithCriteriaRequest } from './web/request/get-group-request-with-criteria.request';
import { GetGroupWithCriteriaQuery } from './cqrs/query/get-group-with-criteria.query';
import { GetGroupWithCriteriaRequest } from './web/request/get-group-with-criteria.request';
import { GetGroupWhereCardIsAdminQuery } from './cqrs/query/get-group-where-card-is-admin.query';
import { GetGroupWhereUserIdIsMemberQuery } from './cqrs/query/get-group-where-user-id-is-member.query';
import { DeleteGroupMembershipCommand } from './cqrs/command/delete-group-membership.command';

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

  async getGroupRequestWithCardIAndGroupIdAdmin(cardId: string, groupId: string): Promise<GroupMembershipResponse[]> {
    return await this.queryBus
      .execute(
        new GetGroupRequestWithCardIdAndGroupIdQuery({
          cardId: cardId,
          groupId: groupId,
        }),
      )
      .then((group: GroupEntity) => {
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

  async getMyGroupRequestWithCardIAndGroupId(
    userId: string,
    cardId: string,
    groupId: string,
  ): Promise<GroupMembershipResponse[]> {
    if (
      !(await this.isCardOwnerWithUserId(userId, cardId)) ||
      !(await this.isUserIdHaveRoleInGroup(userId, groupId, [
        RoleGroupMembershipEnum.ADMIN,
        RoleGroupMembershipEnum.OWNER,
      ]))
    ) {
      throw new ErrorUserIsNotOwnerOfCardRuntimeException(userId, cardId);
    }
    return await this.queryBus
      .execute(
        new GetGroupRequestWithCardIdAndGroupIdQuery({
          cardId: cardId,
          groupId: groupId,
        }),
      )
      .then((group: GroupEntity) => {
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

  async getGroupRequestWithCriteriaAdmin(
    getGroupRequestWithCriteriaRequest: GetGroupRequestWithCriteriaRequest,
  ): Promise<GroupMembershipResponse[]> {
    return await this.queryBus
      .execute(
        new GetGroupRequestWithCriteriaQuery({
          ...getGroupRequestWithCriteriaRequest,
        }),
      )
      .then((group: GroupEntity) => {
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

  async acceptMyGroupRequest(userId: string, request: AcceptGroupRequestRequest): Promise<void> {
    if (!(await this.isCardOwnerWithUserId(userId, request.cardId))) {
      throw new ErrorUserIsNotOwnerOfCardRuntimeException(userId, request.cardId);
    }
    return await this.commandBus.execute(
      new AcceptGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
      }),
    );
  }

  async acceptGroupRequestAdmin(request: AcceptGroupRequestRequest): Promise<void> {
    return await this.commandBus.execute(
      new AcceptGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
      }),
    );
  }

  async cancelMyGroupRequest(userId: string, request: AcceptGroupRequestRequest): Promise<void> {
    if (!(await this.isCardOwnerWithUserId(userId, request.cardId))) {
      throw new ErrorUserIsNotOwnerOfCardRuntimeException(userId, request.cardId);
    }
    return await this.commandBus.execute(
      new CancelGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
        status: GroupRequestStatusEnum.REFUSED,
      }),
    );
  }

  async cancelGroupRequestGroupManager(userId: string, request: AcceptGroupRequestRequest): Promise<void> {
    if (
      !(await this.isUserIdHaveRoleInGroup(userId, request.groupId, [
        RoleGroupMembershipEnum.ADMIN,
        RoleGroupMembershipEnum.OWNER,
      ]))
    ) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, request.groupId);
    }
    return await this.commandBus.execute(
      new CancelGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
        status: GroupRequestStatusEnum.CANCELED,
      }),
    );
  }

  async cancelGroupRequestAdmin(request: AcceptGroupRequestRequest): Promise<void> {
    return await this.commandBus.execute(
      new CancelGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
        status: GroupRequestStatusEnum.CANCELED,
      }),
    );
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

  async deleteMyGroup(userId: string, groupId: string): Promise<void> {
    if (!(await this.isUserIdHaveRoleInGroup(userId, groupId, [RoleGroupMembershipEnum.OWNER]))) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, groupId);
    }
    return await this.commandBus.execute(
      new SoftDeleteGroupCommand({
        groupId: groupId,
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

  async deleteGroupRequestAdmin(request: AcceptGroupRequestRequest): Promise<void> {
    return await this.commandBus.execute(
      new CancelGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
        status: GroupRequestStatusEnum.CANCELED,
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

  async sendGroupRequestAdmin(request: SendGroupRequestRequest): Promise<void> {
    return await this.commandBus.execute(
      new SendGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
      }),
    );
  }

  async sendGroupRequestFromMyGroup(userId: string, request: SendGroupRequestRequest): Promise<void> {
    if (
      !(await this.isUserIdHaveRoleInGroup(userId, request.groupId, [
        RoleGroupMembershipEnum.OWNER,
        RoleGroupMembershipEnum.ADMIN,
      ]))
    ) {
      throw new ErrorUserHaveNoRightOverGroupRuntimeException(userId, request.groupId);
    }
    return await this.commandBus.execute(
      new SendGroupRequestCommand({
        groupId: request.groupId,
        cardId: request.cardId,
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
}
