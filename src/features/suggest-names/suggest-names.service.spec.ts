import { Test, TestingModule } from "@nestjs/testing";
import { SuggestNamesService } from "./suggest-names.service";

describe("FeaturessuggestNamesService", () => {
  let service: SuggestNamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestNamesService],
    }).compile();

    service = module.get<SuggestNamesService>(SuggestNamesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
