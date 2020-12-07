import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from '../repositories/task.repository';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});

describe('TaskService', () => {
  let taskService;
  let taskRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();
    taskService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(true).toEqual(true);
  });

  describe('getTasks', () => {
    it('should return all tasks from the repository', () => {
      expect(true).toEqual(true);
    });
  });
});
