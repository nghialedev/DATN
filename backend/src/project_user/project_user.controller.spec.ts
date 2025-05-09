import { Test, TestingModule } from '@nestjs/testing';
import { ProjectUserController } from './project_user.controller';
import { ProjectUserService } from './project_user.service';

describe('ProjectUserController', () => {
  let controller: ProjectUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectUserController],
      providers: [ProjectUserService],
    }).compile();

    controller = module.get<ProjectUserController>(ProjectUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
