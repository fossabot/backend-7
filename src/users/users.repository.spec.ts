import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserDocument } from './interfaces/user-document.interface';
import { User } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';

const mockUser: (
  id?: string,
  email?: string,
  password?: string,
  name?: string,
) => User = (id, email, password, name) => {
  return {
    id,
    email,
    password,
    name,
  };
};

const mockUserDocument: (mock?: {
  id?: string;
  email?: string;
  password?: string;
  name?: string;
}) => Partial<UserDocument> = (mock?: {
  id: string;
  email: string;
  password: string;
  name: string;
}) => {
  return {
    _id: mock.id,
    email: mock.email,
    password: mock.password,
    name: mock.name,
  };
};

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            updateOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
