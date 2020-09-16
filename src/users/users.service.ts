import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.createOne(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneByEmail(email);
  }
}
