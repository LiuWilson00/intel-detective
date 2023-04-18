import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import {
  CharacterState,
  GameOption,
  InteractableObject,
} from "src/common/interfaces/game.interfaces";
import { GameRound } from "src/common/models/game-history.schema";

export class UpdateGameHistoryDto {
  @IsString()
  story: string;

  @IsArray()
  options: GameOption[];

  @IsArray()
  interactable: InteractableObject[];

  @IsObject()
  characterState: CharacterState;

  @IsNumber()
  gameRound: GameRound;

  @IsOptional()
  @IsBoolean()
  playerSelected: boolean;

  @IsOptional()
  @IsString()
  playerSelection: string | null;
}
