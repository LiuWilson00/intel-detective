import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIController } from './open-ai.controller';

describe('OpenAiController', () => {
  let controller: OpenAIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenAIController],
    }).compile();

    controller = module.get<OpenAIController>(OpenAIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
