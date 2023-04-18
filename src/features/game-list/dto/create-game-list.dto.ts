import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Gender } from "src/common/enums/gender.enum";
import { LangEnum } from "src/common/enums/lang.enum";

export class CreateGameListDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsNotEmpty()
  @IsEnum(LangEnum)
  lang: LangEnum;

  @IsNotEmpty()
  @IsEnum(Gender)
  playerGender: Gender;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  playerName: string;
}
