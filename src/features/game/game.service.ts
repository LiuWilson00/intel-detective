import { Injectable } from "@nestjs/common";
import { JsonToolService } from "src/common/utils/json-tool/json-tool.service";
import { OpenAIService } from "../open-ai/open-ai.service";
import { StartGameDto } from "./dto/start-game.dto";
import {
  CHARACTER_CREATION_PROMPT,
  GAME_START_SYSTEM_PROMPTS,
  MAKE_OPTIONS_PROMPT,
  MAKE_STORY_PROMPT,
  toCharacterStateString,
} from "./prompts/game.prompt";

import {
  CharacterState,
  GameState,
} from "src/common/interfaces/game.interfaces";

import { GameHistoryService } from "../game-history/game-history.service";
import { GameListService } from "../game-list/game-list.service";
import { OccupationsList } from "src/common/utils/game-tool/costants/occupations.costants";
import { Occupation } from "src/common/utils/game-tool/interfaces/occupations.interface";
import { MAKE_NEW_CHARACTER_STATE_PROMPT } from "./prompts/nextStory.prompt";
import { nextStoryMessage } from "./messages/game.message";
import { Gender, LangEnum } from "src/common/types/game.type";
import { GameListDocument } from "src/common/models/game-list.schema";

const model = "gpt-3.5-turbo";
const temperature = 0.9;
const max_tokens = 150;

@Injectable()
export class GameService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly jsonToolService: JsonToolService,
    private readonly gameHistoryService: GameHistoryService,
    private readonly gameListService: GameListService
  ) {}

  async startGame(
    startParams: StartGameDto,
    userId: string
  ): Promise<GameState> {
    const currentGame = await this.gameListService.getGameListById(
      startParams.gameId
    );

    if (!currentGame) {
      throw new Error("Game not found");
    }

    const _occupation = OccupationsList.find(
      (occupation) => occupation.name === startParams.occupation
    );

    if (!_occupation) {
      throw new Error("Occupation not found");
    }

    const tagString = currentGame.tags.join(", ");

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

    const storySegment = await this.generateInitStory(params);

    const optionsText = await this.generateOptions({ ...params, storySegment });

    const combinedText = `${storySegment}\n\n${optionsText}\n\nInitial state: ${toCharacterStateString(
      initialCharacter
    )}`;

    try {
      const json_response = await this.jsonToolService.transformGameSessionJSON(
        combinedText
      );

      this.gameHistoryService.createGameHistory({
        gameId: startParams.gameId,
        gameRound: json_response.round,
        characterState: json_response.state,
        userId: userId,
        playerSelected: false,
        playerSelection: null,
      });

      this.gameListService.updateGameListById(
        startParams.gameId,
        currentGame.tags,
        startParams.lang,
        currentGame.title
      );

      return json_response;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }

  async generateInitStory(params: {
    name: string;
    lang: LangEnum;

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
    lang: LangEnum;
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
  async generateNewCharacterState(params: {
    character: CharacterState;
    theme: string;
    storySegment: string;
    option: string;
    nextStorySegment: string;
  }): Promise<CharacterState> {
    const newStatePrompt = MAKE_NEW_CHARACTER_STATE_PROMPT(params);

    try {
      const response = await this.openaiService.createChatCompletion({
        messages: [
          { role: "system", content: newStatePrompt },
          {
            role: "user",
            content:
              "Please generate the updated character state as a JSON object.",
          },
        ],
        model,
        temperature: 0.6,
      });

      const jsonMatch = this.jsonToolService.findPossibleJSON(response);

      if (!jsonMatch) {
        throw new Error("No valid JSON object found in the response.");
      }

      const json_response: CharacterState = JSON.parse(jsonMatch);

      return json_response;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }

  async generateNextStorySegment(params: {
    lang: LangEnum;
    character: CharacterState;
    theme: string;
    storySegment: string;
    option: string;
    playerExperience: string[];
    currentGame: GameListDocument;
  }): Promise<string> {
    const messages = nextStoryMessage(params, {
      gender: params.currentGame.playerGender,
      name: params.currentGame.playerName,
    });

    try {
      const nextStorySegment = await this.openaiService.createChatCompletion({
        messages,
        model, // Replace with the model name you want to use
        temperature: 0.6,
      });

      if (!nextStorySegment) {
        throw new Error("No next story segment found in the response.");
      }

      return nextStorySegment;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }

  async generateNextGameSession(input: {
    option: string;
    userId: string;
    gameId: string;
  }): Promise<GameState> {
    // Step 1: Get the latest N game histories
    console.log("Getting latest game histories");
    const latestGameHistories = await this.gameHistoryService.getLatestNGameHistoriesByUserId(
      input.userId,
      5
    );

    // Step 2: Get game theme and language
    console.log("Getting game theme and language");
    const currentGame = await this.gameListService.getGameListById(
      input.gameId
    );

    const theme = currentGame.tags.join(", ");
    const lang = currentGame.lang;

    // Step 3: Generate the next story segment
    console.log("Generating next story segment");
    const nextStorySegment = await this.generateNextStorySegment({
      lang,
      character: latestGameHistories[0].state, // Use the latest character state
      theme,
      storySegment: latestGameHistories[0].round.story, // Use the latest story segment
      option: input.option,
      playerExperience: latestGameHistories
        .filter((history) => history.id !== latestGameHistories[0].id)
        .map(
          (history) =>
            `-story:${history.round.story},option:${history.playerSelection}`
        ), // Extract the story segments from the game histories
      currentGame,
    });

    // Step 4: Update the new character state
    console.log("Generating new character state");
    const newCharacterState = await this.generateNewCharacterState({
      character: latestGameHistories[0].state,
      theme,
      storySegment: nextStorySegment,
      option: input.option,
      nextStorySegment,
    });

    // Step 5: Generate the next round options
    console.log("Generating next round options");
    const nextOptions = await this.generateOptions({
      lang,
      theme,
      character: newCharacterState,
      storySegment: nextStorySegment,
    });

    // Step 6: Transform the game session data into the desired JSON format
    const combinedText = `${nextStorySegment}\n\n${nextOptions}\n\nNew state: ${toCharacterStateString(
      newCharacterState
    )}`;

    const json_response = await this.jsonToolService.transformGameSessionJSON(
      combinedText
    );

    // Step 7: Save the new game history
    console.log("Saving new game history");

    // Save the new game history
    this.gameHistoryService.createGameHistory({
      gameId: input.gameId,
      gameRound: json_response.round,
      characterState: json_response.state,
      userId: input.userId,
      playerSelected: false,
      playerSelection: null,
    });

    // Update last game history
    await this.gameHistoryService.updatePlayerSelection(
      input.gameId,
      input.option
    );

    // Return the generated game session JSON
    return json_response;
  }
}
