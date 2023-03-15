import { Injectable } from "@nestjs/common";
import { JsonToolService } from "src/common/utils/json-tool/json-tool.service";
import { OpenAIService } from "../open-ai/open-ai.service";
import { StartGameDto } from "./dto/start-game.dto";
import {
  CHARACTER_CREATION_PROMPT,
  GAME_START_SYSTEM_PROMPTS,
  MAKE_GAME_START_PROMPTS_V3,
  MAKE_OPTIONS_PROMPT,
  MAKE_STORY_PROMPT,
  toCharacterStateString,
} from "./prompts/game.prompt";
import { OccupationsList } from "./costants/occupations.costants";
import { Occupation } from "./interfaces/occupations.interface";
import { AdventureTags } from "./costants/game.constans";
import { CharacterState } from "./dto/game-state.dto";
import { Gender, LangEnum } from "./types/game.type";

const model = "gpt-3.5-turbo";
const temperature = 0.9;
const max_tokens = 150;
const base = 1.1;
@Injectable()
export class GameService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly jsonToolService: JsonToolService
  ) {}

  async startGame(startParams: StartGameDto): Promise<string> {
    const randomTags = this.generateRandomTags(3);
    const tagString = randomTags.join(", ");

    const _occupation =
      OccupationsList.find(
        (occupation) => occupation.name === startParams.occupation
      ) ?? startParams.occupation;

    const initialCharacter = await this.createInitialCharacterState(
      _occupation,
      startParams.name,
      startParams.gender
    );

    const params = {
      name: startParams.name,
      lang: startParams.lang,
      gender: startParams.gender,
      theme: tagString,
      character: initialCharacter,
    };

    const storySegment = await this.generateStory(params);

    const optionsText = await this.generateOptions({ ...params, storySegment });

    const combinedText = `${storySegment}\n\n${optionsText}\n\nInitial state: ${toCharacterStateString(
      initialCharacter
    )}`;

    try {
      const json_response = await this.jsonToolService.transformGameSessionJSON(
        combinedText
      );

      return json_response;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }

  async generateStory(params: {
    name: string;
    lang: LangEnum;
    gender: Gender;
    theme: string;
    character: CharacterState;
  }): Promise<string> {
    const storyPrompt = MAKE_STORY_PROMPT(params);

    const response = await this.openaiService.createChatCompletion({
      messages: [
        { role: "system", content: GAME_START_SYSTEM_PROMPTS },
        { role: "user", content: storyPrompt },
      ],
      model,
      temperature,
      max_tokens,
    });

    return response;
  }

  async generateOptions(params: {
    name: string;
    lang: LangEnum;
    gender: Gender;
    theme: string;
    character: CharacterState;
    storySegment: string;
  }): Promise<string> {
    const optionsPrompt = MAKE_OPTIONS_PROMPT(params);

    const response = await this.openaiService.createChatCompletion({
      messages: [
        { role: "system", content: GAME_START_SYSTEM_PROMPTS },
        { role: "user", content: optionsPrompt },
      ],
      model,
      temperature,
      max_tokens,
    });

    return response;
  }

  generateRandomTags(count: number): string[] {
    const shuffledTags = [...AdventureTags].sort(() => Math.random() - 0.5);
    return shuffledTags.slice(0, count);
  }

  getRandomOccupations(count: number): Occupation[] {
    const totalStars = OccupationsList.reduce(
      (sum, occupation) => sum + occupation.stars,
      0
    );

    const exponentOccupations = OccupationsList.map((occupation) => {
      const weight = Math.pow(base, totalStars - occupation.stars);
      return { ...occupation, weight };
    });

    const totalWeight = exponentOccupations.reduce(
      (sum, occupation) => sum + occupation.weight,
      0
    );

    const weightedOccupations = exponentOccupations.map(
      (occupation, index, array) => {
        const start = array
          .slice(0, index)
          .reduce((sum, item) => sum + item.weight, 0);
        const end = start + occupation.weight;
        return { ...occupation, range: [start, end] };
      }
    );

    const randomOccupations: Occupation[] = Array.from({ length: count }).map(
      () => {
        const randomNumber = Math.random() * totalWeight;
        const selectedOccupation = weightedOccupations.find(
          (occupation) =>
            randomNumber >= occupation.range[0] &&
            randomNumber < occupation.range[1]
        );
        return selectedOccupation;
      }
    );

    return randomOccupations;
  }
  async createInitialCharacterState(
    occupation: Occupation | string,
    name: string,
    gender: Gender
  ): Promise<CharacterState> {
    const characterCreationPrompt = CHARACTER_CREATION_PROMPT(
      occupation,
      name,
      gender
    );
    try {
      // Call the ChatGPT API
      const response = await this.openaiService.createChatCompletion({
        messages: [
          { role: "system", content: characterCreationPrompt },
          {
            role: "user",
            content:
              "Please provide the character's initial state as a JSON object.",
          },
        ],
        model,
        temperature: 0.6,
      });

      const jsonMatch = this.jsonToolService.findPossibleJSON(response);

      if (!jsonMatch) {
        throw new Error("No valid JSON object found in the response.");
      }

      // Parse the returned JSON string and return a CharacterState object
      // console.log(jsonMatch[1]);
      const json_response: CharacterState = JSON.parse(jsonMatch);

      return json_response;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }
}
