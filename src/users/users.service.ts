import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('API_USERS') private apiUsers: any[],
  ) {}
  async getUsers() {
    const DBUsers = await this.usersRepository.getUsers();
    const users = [...DBUsers, ...this.apiUsers];
    return users;
  }

  getUser(id: number) {
    return this.usersRepository.getUserById(id)
  }

  getUserByName(name: string) {
    return this.usersRepository.getUserByName(name);
  }

  createUser(user: any) {
    return this.usersRepository.createUser(user)
  }
}
