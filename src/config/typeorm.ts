import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Todo } from 'src/todos/todos.entity';
// import { Todo } from 'src/todos/todos.entity';
// import { User } from 'src/users/user.entity';

dotenvConfig({ path: '.development.env' });

const config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: 'postgresdb', // comunicacion contenedor - contenedor
  // host: 'host.docker.internal', 
  // host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
    // entities: [User, Todo], // Otra forma
  entities: [__dirname + '/../**/*.entity{.ts,.js'],
  // entities: [''],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: true,
  synchronize: true,
  // dropSchema: true,
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
