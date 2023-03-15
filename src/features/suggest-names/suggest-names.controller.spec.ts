import { Test, TestingModule } from '@nestjs/testing';
import { SuggestNamesController } from './suggest-names.controller';

describe('SuggestNamesController', () => {
  let controller: SuggestNamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestNamesController],
    }).compile();

    controller = module.get<SuggestNamesController>(SuggestNamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
