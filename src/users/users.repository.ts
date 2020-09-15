import { User } from "./interfaces/user.interface";

export interface IUsersRepository {
    findAllByOwnerId(ownerId: string): Promise<User[]>;
  }