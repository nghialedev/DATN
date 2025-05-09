import { Test, TestingModule } from '@nestjs/testing';
import { ProjectTaskStatusService } from './project_task_status.service';

describe('ProjectTaskStatusService', () => {
  let service: ProjectTaskStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectTaskStatusService],
    }).compile();

    service = module.get<ProjectTaskStatusService>(ProjectTaskStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
