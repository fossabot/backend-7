import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from '../users/interfaces/user.interface';
import { UserDocument } from '../users/interfaces/user-document.interface';
import { UsersService } from '../users/users.service';
import { JwtService, JwtModule } from '@nestjs/jwt';

const mockUser: (
  email?: string,
  id?: string,
  password?: string,
  name?: string,
) => User = (email, id, password, name) => {
  return {
    email,
    id,
    password,
    name,
  };
};

const mockUserDocument: (mock?: {
  email?: string;
  id?: string;
  password?: string;
  name?: string;
}) => Partial<User> = (mock?: {
  email: string;
  id: string;
  password: string;
  name: string;
}) => {
  return {
    email: mock.email,
    _id: mock.id,
    password: mock.password,
    name: mock.name,
  };
};

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
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

      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate user when passed proper credentials', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(
        mockUserDocument({
          email: 'test@test.com',
          id: 'id',
          password:
            '$2y$12$IZapIA6nVVUK0wQChi1hMeTgKrxLtrIC7YTAqNADbvuVL2MeHJFza',
          name: 'test',
        }),
      ),
    } as any);

    const validatedUser = await service.validateUser('test@test.com', 'test');
    expect(validatedUser).toMatchObject({ _id: 'id', email: 'test@test.com' });
  });
  it('should not validate user when passed wrong credentials', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(
        mockUserDocument({
          email: 'test@test.com',
          id: 'id',
          password:
            '$2y$12$IZapIA6nVVUK0wQChi1hMeTgKrxLtrIC7YTAqNADbvuVL2MeHJFza',
          name: 'test',
        }),
      ),
    } as any);

    const validatedUser = await service.validateUser('test@test.com', 'test1');
    expect(validatedUser).toBe(null);
  });
});
