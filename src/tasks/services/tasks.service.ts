import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../shared/enums/task-status.enum';
import { CreateTaskDto } from '../shared/dto/create-task.dto';
import { GetTasksFilterDto } from '../shared/dto/get-tasks-filter.dto';
import { TaskRepository } from '../repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class TasksService {
  // private tasks: Task[] = [];

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    // return this.tasks;
    return await this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!foundTask) {
      throw new NotFoundException(`Task with ID="${id}" not found`);
    }

    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    return this.taskRepository.deleteTask(id, user);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
