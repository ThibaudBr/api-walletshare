import { Body, Controller, Delete, Get, Param, Post, UsePipes } from '@nestjs/common';
import { SocialNetworkTestE2eService } from '../service-test/social-network-test-e2e.service';
import { CreateSocialNetworkRequest } from '../../../src/api/social-network/web/request/create-social-network.request';
import { SocialNetworkEntity } from '../../../src/api/social-network/domain/entities/social-network.entity';
import { IsTestEnvironmentPipe } from '../../../src/util/pipe/is-test-environment.pipe';

@Controller()
export class SocialNetworkTestE2eController {
  constructor(private readonly socialNetworkTestE2eService: SocialNetworkTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/create-social-network-test')
  createSocialNetworkTest(@Body() createSocialNetworkDto: CreateSocialNetworkRequest): Promise<SocialNetworkEntity> {
    return this.socialNetworkTestE2eService.createSocialNetworkTest(createSocialNetworkDto);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Delete('/api/test/remove-social-network-test/:id')
  removeSocialNetworkTest(@Param('id') id: string): Promise<void> {
    return this.socialNetworkTestE2eService.removeSocialNetwork(id);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-all-social-networks-test')
  getAllSocialNetworksTest(): Promise<SocialNetworkEntity[]> {
    return this.socialNetworkTestE2eService.getAllSocialNetworks();
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-social-network-test/:id')
  getSocialNetworkTest(@Param('id') socialNetworkId: string): Promise<SocialNetworkEntity | null> {
    return this.socialNetworkTestE2eService.getSocialNetwork(socialNetworkId);
  }
}
