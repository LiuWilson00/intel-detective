import { Controller, Get, Query } from "@nestjs/common";
import { OpenAIService } from "./open-ai.service";

@Controller("openai")
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  //   @Get("/superhero-names")
  //   async getSuperheroNames(@Query("animal") animal: string) {
  //     const names = await this.openAIService.suggestSuperheroNames(animal);
  //     return { names };
  //   }
  //   @Get("/superhero-names/chat-gpt")
  //   async getSuperheroNamesChatGPT(@Query("animal") animal: string) {
  //     const names = await this.openAIService.suggestSuperheroNamesChatGPT(animal);
  //     return { names };
  //   }
}
