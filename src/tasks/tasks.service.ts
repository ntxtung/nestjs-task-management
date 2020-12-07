import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  // private tasks: Task[] = [];

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    // return this.tasks;
    return await this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID="${id}" not found`);
    }

    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id): Promise<void> {
    return this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
