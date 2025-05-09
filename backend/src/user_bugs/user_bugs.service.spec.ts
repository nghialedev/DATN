import { Test, TestingModule } from '@nestjs/testing';
import { UserBugsService } from './user_bugs.service';

describe('UserBugsService', () => {
  let service: UserBugsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBugsService],
    }).compile();

    service = module.get<UserBugsService>(UserBugsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
