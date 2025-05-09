import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDepartmentsController } from './project_departments.controller';
import { ProjectDepartmentsService } from './project_departments.service';

describe('ProjectDepartmentsController', () => {
  let controller: ProjectDepartmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDepartmentsController],
      providers: [ProjectDepartmentsService],
    }).compile();

    controller = module.get<ProjectDepartmentsController>(ProjectDepartmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
