import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOccupationDto } from '../../../src/api/occupation/domain/dto/create-occupation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OccupationEntity } from '../../../src/api/occupation/domain/entities/occupation.entity';

@Injectable()
export class OccupationTestE2eService {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
  ) {}

  async createOccupationTest(createOccupationDto: CreateOccupationDto): Promise<OccupationEntity> {
    return await this.occupationRepository.save({
      name: createOccupationDto.name,
    });
  }

  async removeOccupation(occupationId: string): Promise<void> {
    const occupation = await this.occupationRepository.findOneOrFail({
      where: {
        id: occupationId
      }
    })
    await this.occupationRepository.softRemove(occupation);
  }

  async getOccupation(occupationId: string): Promise<OccupationEntity | null> {
    return await this.occupationRepository.findOne({
      where: {
        id: occupationId,
      },
    });
  }

  async getAllOccupations(): Promise<OccupationEntity[]> {
    return await this.occupationRepository.find({
      withDeleted: true,
    });
  }
}
