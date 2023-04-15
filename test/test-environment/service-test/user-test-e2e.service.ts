import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../src/api/user/domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../../src/api/user/domain/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserTestE2eService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUserTest(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.userRepository.save({
        username: createUserDto.username,
        mail: createUserDto.mail,
        password: bcrypt.hashSync(createUserDto.password, 10),
        roles: createUserDto.roles,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async removeUser(userId: string): Promise<void> {
    await this.userRepository.softDelete({ id: userId });
  }

  async getUser(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      withDeleted: true,
    });
  }
}
