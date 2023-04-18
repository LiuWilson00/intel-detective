import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Gender, LangEnum } from "../types/game.type";

export type GameListDocument = GameList & Document;

@Schema()
export class GameList {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop([String])
  tags: string[];

  @Prop()
  lang: LangEnum;

  @Prop({ options: ["Male", "Female"] })
  playerGender: Gender;

  @Prop()
  playerName: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const GameListSchema = SchemaFactory.createForClass(GameList);
export const GameListDefinition: ModelDefinition = {
  name: GameList.name,
  schema: GameListSchema,
};
