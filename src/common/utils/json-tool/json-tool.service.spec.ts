import { Test, TestingModule } from '@nestjs/testing';
import { JsonToolService } from './json-tool.service';

describe('JsonToolService', () => {
  let service: JsonToolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonToolService],
    }).compile();

    service = module.get<JsonToolService>(JsonToolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
