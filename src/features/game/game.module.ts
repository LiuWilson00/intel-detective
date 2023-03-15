import { Module } from "@nestjs/common";
import { JsonToolModule } from "src/common/utils/json-tool/json-tool.module";
import { OpenAIModule } from "../open-ai/open-ai.module";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";

@Module({
  imports: [OpenAIModule, JsonToolModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
