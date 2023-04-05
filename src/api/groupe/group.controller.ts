import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRoleEnum } from '../user/domain/enum/user-role.enum';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { QueryErrorHttpException } from '../../util/exception/custom-http-exception/query-error.http-exception';
import { GroupResponse } from './web/response/group.response';
import { ErrorInvalidIdRuntimeException } from '../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { InvalidIdHttpException } from '../../util/exception/custom-http-exception/invalid-id.http-exception';
import { RequestUser } from '../auth/interface/request-user.interface';
import { GroupMembershipResponse } from './web/response/group-membership.response';
import { GetGroupWithCriteriaRequest } from './web/request/get-group-with-criteria.request';
import { AcceptGroupRequestRequest } from './web/request/accept-group-request.request';
import { CancelGroupRequestCommand } from './cqrs/command/cancel-group-request.command';
import { RemoveCardFromGroupRequest } from './web/request/remove-card-from-group.request';
import { CreateGroupRequest } from './web/request/create-group.request';
import { GiveAdminRightGroupRequest } from './web/request/give-admin-right-group.request';
import { RemoveAdminRightGroupRequest } from './web/request/remove-admin-right-group.request';
import { SendGroupRequestRequest } from './web/request/send-group-request.request';
import { UpdateGroupRequest } from './web/request/update-group.request';

@Controller('group')
@ApiTags('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('/admin/find-all')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async findAll(): Promise<GroupResponse[]> {
    try {
      return await this.groupService.getAllGroups();
    } catch (error) {
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/admin/:groupId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async findOne(@Param('groupId') groupId: string): Promise<GroupResponse> {
    try {
      return await this.groupService.getGroupById(groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/public/get-my-group/:groupId')
  @HttpCode(201)
  async getMyGroup(@Req() requestUser: RequestUser, @Param('groupId') groupId: string): Promise<GroupResponse> {
    try {
      const userId = requestUser.user.id;
      return await this.groupService.getMyGroup(userId, groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/public/get-my-groups')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getMyGroups(@Req() requestUser: RequestUser): Promise<GroupResponse[]> {
    try {
      const userId = requestUser.user.id;
      return await this.groupService.getAllMyGroups(userId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/admin/get-group-with-user-id/:userId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getGroupWithUserId(@Param('userId') userId: string): Promise<GroupResponse[]> {
    try {
      return await this.groupService.getGroupWhereUserIdAdmin(userId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/admin/get-group-member-with-group-id/:groupId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getGroupMemberWithGroupId(@Param('groupId') groupId: string): Promise<GroupMembershipResponse[]> {
    try {
      return await this.groupService.getGroupMemberByGroupIdAdmin(groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/public/get-group-member-with-group-id/:groupId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getGroupMemberWithGroupIdPublic(
    @Req() requestUser: RequestUser,
    @Param('groupId') groupId: string,
  ): Promise<GroupMembershipResponse[]> {
    try {
      const userId = requestUser.user.id;
      return await this.groupService.getGroupMemberByMyGroupId(userId, groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/public/get-group-member-with-card-id/:cardId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getGroupMemberWithCardIdPublic(
    @Req() requestUser: RequestUser,
    @Param('cardId') cardId: string,
  ): Promise<GroupMembershipResponse[]> {
    try {
      const userId = requestUser.user.id;
      return await this.groupService.getGroupMembershipByMyCardId(userId, cardId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/admin/get-group-member-with-card-id-and-group-id/:cardId/:groupId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getGroupMemberWithCardIdAndGroupIdAdmin(
    @Param('cardId') cardId: string,
    @Param('groupId') groupId: string,
  ): Promise<GroupMembershipResponse[]> {
    try {
      return await this.groupService.getGroupRequestWithCardIAndGroupIdAdmin(cardId, groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/public/get-group-member-with-card-id-and-group-id/:cardId/:groupId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getGroupMemberWithCardIdAndGroupIdPublic(
    @Req() requestUser: RequestUser,
    @Param('cardId') cardId: string,
    @Param('groupId') groupId: string,
  ): Promise<GroupMembershipResponse[]> {
    try {
      const userId = requestUser.user.id;
      return await this.groupService.getMyGroupRequestWithCardIAndGroupId(userId, cardId, groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Post('/admin/get-group-with-criteria')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getGroupWithCriteria(@Body() groupCriteria: GetGroupWithCriteriaRequest): Promise<GroupResponse[]> {
    try {
      return await this.groupService.getGroupWithCriteriaAdmin(groupCriteria);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Post('/public/get-group-request-with-criteria')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getGroupRequestWithCriteria(
    @Body() groupCriteria: GetGroupWithCriteriaRequest,
  ): Promise<GroupMembershipResponse[]> {
    try {
      return await this.groupService.getGroupRequestWithCriteriaAdmin(groupCriteria);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/public/get-group-where-card-id-is-admin/:cardId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getGroupWhereCardIdIsAdmin(
    @Req() requestUser: RequestUser,
    @Param('cardId') cardId: string,
  ): Promise<GroupResponse[]> {
    try {
      const userId = requestUser.user.id;
      return await this.groupService.getGroupWhereMyCardIsAdminRole(userId, cardId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Get('/admin/get-group-where-card-id-is-admin/:cardId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getGroupWhereCardIdIsAdminAdmin(@Param('cardId') cardId: string): Promise<GroupResponse[]> {
    try {
      return await this.groupService.getGroupWhereCardIsAdminRoleAdmin(cardId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/admin/accept-group-request')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async acceptGroupRequest(@Body() groupRequest: AcceptGroupRequestRequest): Promise<void> {
    try {
      await this.groupService.acceptGroupRequestAdmin(groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/admin/decline-group-request')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async declineGroupRequest(@Body() groupRequest: AcceptGroupRequestRequest): Promise<void> {
    try {
      await this.groupService.cancelGroupRequestAdmin(groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/public/accept-group-request')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async acceptGroupRequestPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: AcceptGroupRequestRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.acceptMyGroupRequest(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/public/decline-group-request')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async declineGroupRequestPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: CancelGroupRequestCommand,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.cancelMyGroupRequest(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/public/cancel-group-request')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async cancelGroupRequestPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: AcceptGroupRequestRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.cancelGroupRequestGroupManager(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }
  @Put('/public/leave-group')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async leaveGroupPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: RemoveCardFromGroupRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.leaveGroup(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Post('/public/create-group')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async createGroupPublic(@Req() requestUser: RequestUser, @Body() groupRequest: CreateGroupRequest): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.createMyGroup(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Post('/admin/create-group')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createGroupAdmin(@Body() groupRequest: CreateGroupRequest): Promise<void> {
    try {
      await this.groupService.createGroupAdmin(groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Delete('/public/delete-group/:groupId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async deleteGroupPublic(@Req() requestUser: RequestUser, @Param('groupId') groupId: string): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.softDeleteMyGroup(userId, groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Delete('/admin/delete-group/:groupId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteGroupAdmin(@Param('groupId') groupId: string): Promise<void> {
    try {
      await this.groupService.deleteGroupAdmin(groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Delete('/admin/delete-group-request/:groupId/:cardId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteGroupRequestAdmin(@Param('groupId') groupId: string, @Param('cardId') cardId: string): Promise<void> {
    try {
      await this.groupService.deleteGroupRequestAdmin({
        groupId: groupId,
        cardId: cardId,
      });
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/public/give-admin-rights')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async giveAdminRightsPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: GiveAdminRightGroupRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.giveMyGroupRightToCard(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/public/remove-admin-rights')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async removeAdminRightsPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: RemoveAdminRightGroupRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.removeMyGroupRightToCard(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/admin/give-admin-rights')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async giveAdminRightsAdmin(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: GiveAdminRightGroupRequest,
  ): Promise<void> {
    try {
      await this.groupService.giveGroupRightToCardAdmin(groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/admin/remove-admin-rights')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeAdminRightsAdmin(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: RemoveAdminRightGroupRequest,
  ): Promise<void> {
    try {
      await this.groupService.removeGroupRightToCardAdmin(groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/public/remove-card-from-group')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async removeCardFromGroupPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: RemoveCardFromGroupRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.removeCardFromMyGroup(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/admin/remove-card-from-group')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeCardFromGroupAdmin(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: RemoveCardFromGroupRequest,
  ): Promise<void> {
    try {
      await this.groupService.removeCardFromGroupAdmin(groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/admin/restore-group/:groupId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreGroupAdmin(@Param('groupId') groupId: string): Promise<void> {
    try {
      await this.groupService.restoreGroupAdmin(groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Post('/public/invite-card-to-group')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async inviteCardToGroupPublic(
    @Req() requestUser: RequestUser,
    @Body() groupRequest: SendGroupRequestRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.sendGroupRequestFromMyGroup(userId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Post('/admin/invite-card-to-group')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async inviteCardToGroupAdmin(@Body() groupRequest: SendGroupRequestRequest): Promise<void> {
    try {
      await this.groupService.sendGroupRequestAdmin(groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Delete('/admin/soft-delete-group/:groupId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softDeleteGroupAdmin(@Param('groupId') groupId: string): Promise<void> {
    try {
      await this.groupService.softDeleteGroupAdmin(groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/admin/update-group/:groupId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateGroupAdmin(@Param('groupId') groupId: string, @Body() groupRequest: UpdateGroupRequest): Promise<void> {
    try {
      await this.groupService.updateGroupAdmin(groupId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Put('/public/update-group/:groupId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async updateGroupPublic(
    @Req() requestUser: RequestUser,
    @Param('groupId') groupId: string,
    @Body() groupRequest: UpdateGroupRequest,
  ): Promise<void> {
    try {
      const userId = requestUser.user.id;
      await this.groupService.updateMyGroup(userId, groupId, groupRequest);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }

  @Delete('/admin/delete-group-membership/:groupId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteGroupMembershipAdmin(@Param('groupId') groupId: string): Promise<void> {
    try {
      await this.groupService.deleteGroupMembershipAdmin(groupId);
    } catch (error) {
      if (error instanceof ErrorInvalidIdRuntimeException) throw new InvalidIdHttpException(error.message);
      if (error instanceof RuntimeException) throw new QueryErrorHttpException();
      else throw error;
    }
  }
}
