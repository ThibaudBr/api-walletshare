import { GroupTestE2eService } from '../service-test/group-test-e2e.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { IsTestEnvironmentPipe } from '../../../src/util/pipe/is-test-environment.pipe';
import { CreateGroupRequest } from '../../../src/api/groupe/web/request/create-group.request';
import { GroupEntity } from '../../../src/api/groupe/domain/entities/group.entity';
import { AddCardToGroupRequest } from '../../../src/api/groupe/web/request/add-card-to-group.request';
import { GroupMembershipEntity } from '../../../src/api/groupe/domain/entities/group-membership.entity';
import { RoleGroupMembershipEnum } from '../../../src/api/groupe/domain/enum/role-group-membership.enum';

@Controller()
export class GroupTestE2eController {
  constructor(private readonly groupTestE2eService: GroupTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/create-group-test')
  async createGroupTest(@Body() createGroupRequest: CreateGroupRequest): Promise<GroupEntity> {
    return await this.groupTestE2eService.createGroupTest({
      name: createGroupRequest.name,
      cardId: createGroupRequest.cardId,
    });
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Delete('/api/test/remove-group-test/:id')
  async removeGroupTest(@Param('id') id: string): Promise<void> {
    return await this.groupTestE2eService.removeGroup(id);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-all-group-test')
  async getAllGroupTest(): Promise<GroupEntity[]> {
    return await this.groupTestE2eService.getAllGroup();
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-group-test/:id')
  getGroupTest(@Param('id') id: string): Promise<GroupEntity> {
    return this.groupTestE2eService.getGroup(id);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Put('/api/test/add-group-membership/:role')
  async addGroupMembership(
    @Param('role') role: RoleGroupMembershipEnum,
    @Body() addCardToGroupRequest: AddCardToGroupRequest,
  ): Promise<GroupMembershipEntity> {
    return await this.groupTestE2eService.addGroupMembership(
      addCardToGroupRequest.groupId,
      addCardToGroupRequest.cardIdList[0],
      role,
    );
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Put('/api/test/remove-group-membership/:id')
  async removeGroupMembership(@Param('id') id: string): Promise<void> {
    return await this.groupTestE2eService.removeGroupMembership(id);
  }
}
