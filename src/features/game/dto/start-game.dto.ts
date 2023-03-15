import { Gender, LangEnum } from "../types/game.type";

export class StartGameDto {
  lang: LangEnum;
  name: string;
  gender: Gender;
  occupation: string;
}
