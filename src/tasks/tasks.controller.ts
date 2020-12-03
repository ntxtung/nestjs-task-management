import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private taskServices: TasksService) {}

  @Get()
  getAllTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
    if (Object.keys(filterDto).length) {
      return this.taskServices.getTasksWithFilter(filterDto);
    } else {
      return this.taskServices.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.taskServices.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskServices.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ) {
    return this.taskServices.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string) {
    return this.taskServices.deleteTaskById(id);
  }
}
