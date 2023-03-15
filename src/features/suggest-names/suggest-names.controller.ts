import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { SuggestNamesService } from "./suggest-names.service";

@Controller("suggest-names")
export class SuggestNamesController {
  constructor(private readonly suggestNamesService: SuggestNamesService) {}

  @Get(":animal")
  async suggestSuperheroNames(
    @Param("animal") animal: string
  ): Promise<string[]> {
    try {
      const names = await this.suggestNamesService.suggestSuperheroNames(
        animal
      );
      return names;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":animal/chat")
  async suggestSuperheroNamesChatGPT(
    @Param("animal") animal: string
  ): Promise<string[]> {
    try {
      const names = await this.suggestNamesService.suggestSuperheroNamesChatGPT(
        animal
      );
      return names;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
