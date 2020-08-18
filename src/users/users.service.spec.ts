import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

const user = <User>{ email: 'test', password: '', name: '' }

class UserModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([user]);
  static findOne = jest.fn().mockResolvedValue(user);
  static findOneAndUpdate = jest.fn().mockResolvedValue(user);
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('UsersService', () => {
  let service: UsersService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getModelToken('User'),
        useValue: UserModel
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of users', async () => {
    const result = [user];

    expect(await service.findAll()).toBe(result);
  })
});
