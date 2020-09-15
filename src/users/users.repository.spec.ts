import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserDocument } from './interfaces/user-document.interface';
import { User } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';

const mockUser: (
  _id?: string,
  email?: string,
  password?: string,
  name?: string,
) => User = (_id, email, password, name) => {
  return {
    _id,
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

const usersArray: User[] = [
  mockUser('1', 'test1@test.com', 'test1', 'name1'),
  mockUser('2', 'test2@test.com', 'test2', 'name2'),
  mockUser('3', 'test3@test.com', 'test3', 'name3'),
];

const usersDocArray = [
  mockUserDocument({
    id: '1',
    email: 'test1@test.com',
    password: 'test1',
    name: 'name1',
  }),
  mockUserDocument({
    id: '2',
    email: 'test2@test.com',
    password: 'test2',
    name: 'name2',
  }),
  mockUserDocument({
    id: '3',
    email: 'test3@test.com',
    password: 'test3',
    name: 'name3',
  }),
];

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

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersDocArray),
    } as any);
    const users = await repository.findAll();
    expect(users).toEqual(usersArray);
  });
});
