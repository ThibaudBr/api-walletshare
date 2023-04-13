import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { OccupationTestE2eService } from '../service-test/occupation-test-e2e.service';
import { OccupationEntity } from '../../../src/api/occupation/domain/entities/occupation.entity';
import { CreateOccupationDto } from '../../../src/api/occupation/domain/dto/create-occupation.dto';
import { IsTestEnvironmentPipe } from '../../../src/util/pipe/is-test-environment.pipe';

@Controller()
export class OccupationTestE2eController {
  constructor(private readonly occupationTestE2eService: OccupationTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/create-occupation-test')
  createOccupationTest(@Body() createOccupationDto: CreateOccupationDto): Promise<OccupationEntity> {
    return this.occupationTestE2eService.createOccupationTest(createOccupationDto);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/remove-occupation-test')
  removeOccupationTest(@Body() occupationId: string): Promise<void> {
    return this.occupationTestE2eService.removeOccupation(occupationId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/get-all-occupations-test')
  getAllOccupationsTest(): Promise<OccupationEntity[]> {
    return this.occupationTestE2eService.getAllOccupations();
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/get-occupation-test')
  getOccupationTest(@Body() occupationId: string): Promise<OccupationEntity | null> {
    return this.occupationTestE2eService.getOccupation(occupationId);
  }
}
