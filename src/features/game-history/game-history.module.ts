import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GameHistoryDefinition } from "src/common/models/game-history.schema";
import { GameHistoryService } from "./game-history.service";
import { GameHistoryController } from './game-history.controller';

@Module({
  imports: [MongooseModule.forFeature([GameHistoryDefinition])],
  providers: [GameHistoryService],
  exports: [GameHistoryService],
  controllers: [GameHistoryController],
})
export class GameHistoryModule {}
