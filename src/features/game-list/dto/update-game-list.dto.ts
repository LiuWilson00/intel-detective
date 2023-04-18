import { LangEnum } from "src/common/types/game.type";

export class UpdateGameListDto {
  title: string;
  tags: string[];
  description?: string;
  lang?: LangEnum;
  playerName?: string;
}
