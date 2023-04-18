import { Module } from "@nestjs/common";
import { GameListService } from "./game-list.service";
import { GameListController } from "./game-list.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { GameListDefinition } from "src/common/models/game-list.schema";

@Module({
  imports: [MongooseModule.forFeature([GameListDefinition])],
  providers: [GameListService],
  exports: [GameListService],
  controllers: [GameListController],
})
export class GameListModule {}
