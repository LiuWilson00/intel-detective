import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
  CharacterState,
  GameOption,
  InteractableObject,
} from "src/common/interfaces/game.interfaces";

export interface GameRound {
  story: string;
  options: GameOption[];
  interactable: InteractableObject[];
}

@Schema()
export class GameHistory {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true, type: Object })
  round: GameRound;

  @Prop({ required: true, type: Object })
  state: CharacterState;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  playerSelected: boolean;

  @Prop({ default: null })
  playerSelection: string | null;
}

export type GameHistoryDocument = GameHistory & Document;
export const GameHistorySchema = SchemaFactory.createForClass(GameHistory);
export const GameHistoryDefinition: ModelDefinition = {
  name: GameHistory.name,
  schema: GameHistorySchema,
};
