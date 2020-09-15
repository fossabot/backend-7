import { User } from './interfaces/user.interface';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findOneById(email: string): Promise<User>;
  createOne(user: User): Promise<User>;
}
