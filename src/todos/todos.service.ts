import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({ order: { id: 'ASC' } });
  }

  async findCompleted(): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { completed: true },
      order: { created_at: 'DESC' },
    });
  }

  async findByPriority(level: string): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { priority: level },
      order: { created_at: 'DESC' },
    });
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      priority: createTodoDto.priority || 'low',
    });
    return this.todoRepository.save(todo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');
    Object.assign(todo, {
      ...updateTodoDto,
      priority: updateTodoDto.priority || todo.priority,
    });
    return this.todoRepository.save(todo);
  }

  async toggleCompletion(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');
    todo.completed = !todo.completed;
    return this.todoRepository.save(todo);
  }

  async delete(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Todo not found');
  }
}