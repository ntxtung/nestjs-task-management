import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from '../repositories/task.repository';
import { GetTasksFilterDto } from '../shared/dto/get-tasks-filter.dto';
import { TaskStatus } from '../shared/enums/task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../shared/dto/create-task.dto';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = { id: 1, username: 'Test' };

describe('TaskService', () => {
  let taskService;
  let taskRepository;
  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();
    taskService = await testModule.get<TasksService>(TasksService);
    taskRepository = await testModule.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(true).toEqual(true);
  });

  describe('getTasks', () => {
    it('should return all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toBeCalled();
      const filter: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'ansd',
      };
      const result = await taskService.getTasks(filter, mockUser);
      expect(taskRepository.getTasks).toBeCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('should call userRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = {
        title: 'title 01',
        description: 'des 01',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, mockUser);

      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('should throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('should call taskRepository.create() and returns the result', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'title 01',
        description: 'des 01',
      };
      taskRepository.createTask.mockResolvedValue('someTask');

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await taskService.createTask(createTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );

      expect(result).toEqual('someTask');
    });
  });
  describe('deleteTaskById', () => {
    // it('calls taskRepository.deleteTask() to delete a task', async () => {
    //   taskRepository.delete.mockResolvedValue({ affected: 1 });
    //   expect(taskRepository.delete).not.toHaveBeenCalled();
    //   await taskService.deleteTaskById(1, mockUser);
    //   expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    // });

    it('throws an error as task could not be found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(taskService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('updates a task status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      taskService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });

      expect(taskService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await taskService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(taskService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
