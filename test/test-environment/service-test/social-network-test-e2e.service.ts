import { Injectable } from '@nestjs/common';
import { SocialNetworkEntity } from '../../../src/api/social-network/domain/entities/social-network.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSocialNetworkRequest } from '../../../src/api/social-network/web/request/create-social-network.request';

@Injectable()
export class SocialNetworkTestE2eService {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
  ) {}

  async createSocialNetworkTest(socialNetworkDto: CreateSocialNetworkRequest): Promise<SocialNetworkEntity> {
    return await this.socialNetworkRepository.save({
      name: socialNetworkDto.name,
      url: socialNetworkDto.url,
      icon: socialNetworkDto.icon,
      color: socialNetworkDto.color,
    });
  }

  async removeSocialNetwork(socialNetworkId: string): Promise<void> {
    await this.socialNetworkRepository.softDelete(socialNetworkId);
  }

  async getSocialNetwork(socialNetworkId: string): Promise<SocialNetworkEntity | null> {
    return await this.socialNetworkRepository.findOne({
      withDeleted: true,
      where: {
        id: socialNetworkId,
      },
    });
  }

  async getAllSocialNetworks(): Promise<SocialNetworkEntity[]> {
    return await this.socialNetworkRepository.find({
      withDeleted: true,
    });
  }
}
