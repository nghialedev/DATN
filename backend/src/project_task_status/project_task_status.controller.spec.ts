import { Test, TestingModule } from '@nestjs/testing';
import { ProjectTaskStatusController } from './project_task_status.controller';
import { ProjectTaskStatusService } from './project_task_status.service';

describe('ProjectTaskStatusController', () => {
  let controller: ProjectTaskStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectTaskStatusController],
      providers: [ProjectTaskStatusService],
    }).compile();

    controller = module.get<ProjectTaskStatusController>(ProjectTaskStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
