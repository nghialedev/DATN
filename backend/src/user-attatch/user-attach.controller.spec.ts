import { Test, TestingModule } from '@nestjs/testing';
import { UserAttachController } from './user-attach.controller';
import { UserAttachService } from './user-attach.service';

describe('UserController', () => {
  let controller: UserAttachController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAttachController],
      providers: [UserAttachService],
    }).compile();

    controller = module.get<UserAttachController>(UserAttachController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
