import { Inject, Injectable } from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository,
    @InjectRepository(Todo)
    private readonly todosDbRepository: Repository<Todo>,
    // Inject es para inyectar valores, datos que no son clases. para inyectar valores que
    // no han sido decorados previamente con Injectable
    @Inject('ACCESS_TOKEN') private accessToken: string,
  ) {}
  // getTodos() {
  //   return this.accessToken === 'Clavesecreta'
  //     ? this.todosRepository.getTodos()
  //     : 'No tienes acceso';
  // }

  getTodos() {
    return this.todosDbRepository.find({
      relations: ['files'],
    });
  }

  findById(id: number) {
    return this.todosDbRepository.findOneBy({ id });
  }

  createTodo(todo: Todo) {
    return this.todosDbRepository.save(todo);
  }
}
