import { Gender, LangEnum } from "src/common/types/game.type";


export class StartGameDto {
  lang: LangEnum;
  name: string;
  gender: Gender;
  occupation: string;
  gameId: string;
}
