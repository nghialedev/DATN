import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDepartmentsService } from './project_departments.service';

describe('ProjectDepartmentsService', () => {
  let service: ProjectDepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectDepartmentsService],
    }).compile();

    service = module.get<ProjectDepartmentsService>(ProjectDepartmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
