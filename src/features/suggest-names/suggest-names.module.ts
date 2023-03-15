import { Module } from "@nestjs/common";
import { OpenAIModule } from "../open-ai/open-ai.module";
import { SuggestNamesController } from "./suggest-names.controller";
import { SuggestNamesService } from "./suggest-names.service";

@Module({
  imports: [OpenAIModule],
  controllers: [SuggestNamesController],
  providers: [SuggestNamesService],
})
export class SuggestNamesModule {}
