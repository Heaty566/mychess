import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';

describe('RepositoryController', () => {
  let controller: RepositoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepositoryController],
      providers: [RepositoryService],
    }).compile();

    controller = module.get<RepositoryController>(RepositoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
