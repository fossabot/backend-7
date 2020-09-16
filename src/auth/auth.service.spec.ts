import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

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
  email?: string;
  _id?: string;
  password?: string;
  name?: string;
}) => Partial<User> = (mock?: {
  email: string;
  _id: string;
  password: string;
  name: string;
}) => {
  return {
    _id: mock._id,
    email: mock.email,
    password: mock.password,
    name: mock.name,
  };
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByEmail: jest.fn(),
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
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate user when passed proper credentials', async () => {
    jest
      .spyOn(usersService, 'findByEmail')
      .mockResolvedValue(
        mockUser(
          'id',
          'test@test.com',
          '$2y$12$IZapIA6nVVUK0wQChi1hMeTgKrxLtrIC7YTAqNADbvuVL2MeHJFza',
          'test',
        ),
      );

    const validatedUser = await service.validateUser('test@test.com', 'test');
    expect(validatedUser).toMatchObject({ _id: 'id', email: 'test@test.com' });
  });
  it('should not validate user when passed wrong credentials', async () => {
    jest
      .spyOn(usersService, 'findByEmail')
      .mockResolvedValue(
        mockUser(
          'id',
          'test@test.com',
          '$2y$12$IZapIA6nVVUK0wQChi1hMeTgKrxLtrIC7YTAqNADbvuVL2MeHJFza',
          'test',
        ),
      );

    const validatedUser = await service.validateUser('test@test.com', 'test1');
    expect(validatedUser).toBe(null);
  });
  it('should return access token on login', async () => {
    const accessToken = await service.login({
      email: 'test@test.com',
      _id: 'id',
    });
    expect(accessToken).toMatchObject({ access_token: expect.any(String) });
  });
  it('should register new user', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    jest.spyOn(usersService, 'create').mockResolvedValueOnce({
      _id: '1',
      email: 'test@test.com',
      password: 'test',
      name: 'test',
    });

    const newUser = await service.register({
      email: 'test@test.com',
      password: 'test',
      name: 'test',
    });

    expect(newUser).toMatchObject({
      email: 'test@test.com',
      password: 'test',
      name: 'test',
      _id: expect.any(String),
    });
  });
  it('should return conflict when register a user with existing email address', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(
      mockUserDocument({
        email: 'test@test.com',
        _id: 'id',
        password:
          '$2y$12$IZapIA6nVVUK0wQChi1hMeTgKrxLtrIC7YTAqNADbvuVL2MeHJFza',
        name: 'test',
      }) as any,
    );

    jest.spyOn(usersService, 'create').mockResolvedValueOnce({
      _id: '1',
      email: 'test@test.com',
      password: 'test',
      name: 'test',
    } as any);

    expect(
      service.register({
        email: 'test@test.com',
        password: 'test',
        name: 'test',
      }),
    ).rejects.toEqual(
      new HttpException(
        'User with this email address already exists',
        HttpStatus.CONFLICT,
      ),
    );
  });
});
