import { Test, TestingModule } from '@nestjs/testing';
import { UserBugsController } from './user_bugs.controller';
import { UserBugsService } from './user_bugs.service';

describe('UserBugsController', () => {
  let controller: UserBugsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBugsController],
      providers: [UserBugsService],
    }).compile();

    controller = module.get<UserBugsController>(UserBugsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
