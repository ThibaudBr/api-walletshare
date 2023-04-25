import { Body, Controller, Delete, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ProfileTestE2eService } from '../service-test/profile-test-e2e.service';
import { CreateProfileRequest } from '../../../src/api/profile/web/request/create-profile.request';
import { IsTestEnvironmentPipe } from '../../../src/util/pipe/is-test-environment.pipe';
import { ProfileEntity } from '../../../src/api/profile/domain/entities/profile.entity';

@Controller()
export class ProfileTestE2eController {
  constructor(private readonly profileTestE2eService: ProfileTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/create-profile-test')
  createProfileTest(@Body() createProfileRequest: CreateProfileRequest): Promise<ProfileEntity> {
    return this.profileTestE2eService.createProfileTest(createProfileRequest);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Delete('/api/test/remove-profile-test/:id')
  removeProfileTest(@Param('id') id: string): Promise<void> {
    return this.profileTestE2eService.removeProfile(id);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-all-profiles-test')
  getAllProfilesTest(): Promise<ProfileEntity[]> {
    return this.profileTestE2eService.getAllProfiles();
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-profile-test/:id')
  getProfileTest(@Param('id') profileId: string): Promise<ProfileEntity | null> {
    return this.profileTestE2eService.getProfile(profileId);
  }
}
