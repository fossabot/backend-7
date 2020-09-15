import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserDocument } from './interfaces/user-document.interface';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findOneById(email: string): Promise<User>;
  createOne(user: User): Promise<User>;
}

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find({}).exec();
  }

  async findOneById(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async createOne(user: User): Promise<User> {
    return await this.userModel.create(user);
  }
}
