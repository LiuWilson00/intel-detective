import { Injectable } from "@nestjs/common";
import { OpenAIService } from "../open-ai/open-ai.service";

@Injectable()
export class SuggestNamesService {
  constructor(private readonly openaiService: OpenAIService) {}
  async suggestSuperheroNames(animal: string): Promise<string[]> {
    const capitalizedAnimal =
      animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
    const prompt = `Suggest three names for an animal that is a superhero.\n\nAnimal: ${capitalizedAnimal}\nNames:`;
    const model = "text-davinci-003";
    const temperature = 0.6;
    const maxTokens = 30;

    try {
      const response = await this.openaiService.createCompletion({
        prompt,
        model,
        temperature,
        max_tokens: maxTokens,
      });
      const names = response.split("\n").filter((name) => name !== "");

      if (names.length !== 3) {
        throw new Error(
          `OpenAI API response does not contain 3 names: ${response}`
        );
      }

      return names;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }
  async suggestSuperheroNamesChatGPT(animal: string): Promise<string[]> {
    const capitalizedAnimal =
      animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
    const prompt = `Suggest three names for an animal that is a superhero.\n\nAnimal: ${capitalizedAnimal}\nNames:`;
    const model = "gpt-3.5-turbo";
    const temperature = 0.6;
    const maxTokens = 30;

    try {
      const response = await this.openaiService.createChatCompletion({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        model,
        temperature,
        max_tokens: maxTokens,
      });
      const names = response.split("\n").filter((name) => name !== "");

      if (names.length !== 3) {
        throw new Error(
          `OpenAI API response does not contain 3 names: ${response}`
        );
      }

      return names;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }
}
