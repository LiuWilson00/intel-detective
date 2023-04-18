import { Module } from "@nestjs/common";
import { JsonToolModule } from "src/common/utils/json-tool/json-tool.module";
import { GameHistoryModule } from "../game-history/game-history.module";
import { GameListModule } from "../game-list/game-list.module";
import { OpenAIModule } from "../open-ai/open-ai.module";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";

@Module({
  imports: [OpenAIModule, JsonToolModule, GameHistoryModule, GameListModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
