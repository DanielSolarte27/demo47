import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersDbService } from './users-db.service';
import { CloudinaryConfig } from '../config/cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { AuthService } from './auth.service';
import { requiresAuth } from 'express-openid-connect';

// const mockUsersService = {
//   getUsers() {
//     return 'Esta es la funcion mock';
//   },
// };

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // providers: [UsersService, UsersRepository], // providers normal

  //* useFactory
  providers: [
    UsersService,
    CloudinaryConfig,
    CloudinaryService,
    UsersRepository,
    AuthService,
    {
      provide: 'API_USERS',
      useFactory: async () => {
        const apiUsers = await fetch(
          'https://jsonplaceholder.typicode.com/users',
        ).then((response) => response.json());
        const cleanUsers = apiUsers.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        });
        return cleanUsers;
      },
    },
    UsersDbService,
  ],
  //* Provider personalizado
  //   providers: [
  //     {
  //       provide: UsersService,
  //       useValue: mockUsersService,
  //     },
  //     UsersRepository,
  //   ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('users');
    consumer.apply(requiresAuth()).forRoutes('users/auth0/protected');
  }
}
