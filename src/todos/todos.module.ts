import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodosRepository } from './todos.repository';
import { Todo } from './todos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './files.entity';
import { FilesService } from './files.service';

const ACCESS = 'Clavesecreta';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, File])],
  controllers: [TodosController],
  providers: [
    TodosService,
    FilesService,
    TodosRepository,
    {
      provide: 'ACCESS_TOKEN',
      useValue: ACCESS,
    },
  ],
})
export class TodosModule {}
