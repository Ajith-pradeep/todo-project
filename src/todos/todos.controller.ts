import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get('completed')
  findCompleted(): Promise<Todo[]> {
    return this.todosService.findCompleted();
  }

  @Get('priority/:level')
  findByPriority(@Param('level') level: string): Promise<Todo[]> {
    return this.todosService.findByPriority(level);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Patch(':id/toggle')
  toggleCompletion(@Param('id') id: string): Promise<Todo> {
    return this.todosService.toggleCompletion(+id);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id') id: string): Promise<void> {
    return this.todosService.delete(+id);
  }
}