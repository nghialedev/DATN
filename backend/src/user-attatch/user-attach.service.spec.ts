import { Test, TestingModule } from '@nestjs/testing';
import { UserAttachService } from './user-attach.service';

describe('UserService', () => {
  let service: UserAttachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAttachService],
    }).compile();

    service = module.get<UserAttachService>(UserAttachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
