import { Module } from "@nestjs/common";
import { OpenAIModule } from "src/features/open-ai/open-ai.module";
import { JsonToolService } from "./json-tool.service";

@Module({
  imports: [OpenAIModule],
  providers: [JsonToolService],
  exports: [JsonToolService],
})
export class JsonToolModule {}
