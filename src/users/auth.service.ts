import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersDbService } from './users-db.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersDbService: UsersDbService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: User) {
    const userFound = await this.usersDbService.findByEmail(user.email);

    if (userFound) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }

    

    return await this.usersDbService.create({ ...user, password: hashedPassword });
  }

  async signIn(email: string, password: string) {
    const userFound = await this.usersDbService.findByEmail(email);

    if (!userFound) {
      throw new BadRequestException('Invalid Credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Credentials');
    }

    const userPayload = {
      id: userFound.id,
      email: userFound.email,
    };

    const token = this.jwtService.sign(userPayload);

    return {
      message: 'User logged in',
      token,
    };
  }
}
