import { Injectable } from "@nestjs/common";
import { OpenAIService } from "src/features/open-ai/open-ai.service";
import {
  FIX_JSON_SYSTEM_PROMP,
  JSON_TRANSFORM_SYSTEM_PROMP,
  MAKE_FIX_JSON_PROMPTS,
  // MAKE_GAME_SESSION_JSON_TRANSFORM_PROMPTS_LITE,
  MAKE_GAME_SESSION_JSON_TRANSFORM_PROMPTS_V2,
} from "./prompts/json.prompt";
import { GameState } from "../../interfaces/game.interfaces";
const model = "gpt-3.5-turbo";
const temperature = 0.9;
@Injectable()
export class JsonToolService {
  constructor(private readonly openaiService: OpenAIService) {}
  async transformGameSessionJSON(gameText: string): Promise<GameState> {
    try {
      const response = await this.openaiService.createChatCompletion({
        messages: [
          { role: "system", content: JSON_TRANSFORM_SYSTEM_PROMP },
          {
            role: "user",
            content: MAKE_GAME_SESSION_JSON_TRANSFORM_PROMPTS_V2(gameText),
          },
        ],
        model,
        temperature,
      });

      const possibleJSON = this.findPossibleJSON(response);

      if (!possibleJSON) {
        throw new Error("No valid JSON object found in the response.");
      }

      if (isJSON(possibleJSON)) {
        return JSON.parse(possibleJSON);
      } else {
        return await this.fixJSON(possibleJSON);
      }
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }
  async fixJSON(json: string): Promise<any> {
    try {
      const response = await this.openaiService.createChatCompletion({
        messages: [
          { role: "system", content: FIX_JSON_SYSTEM_PROMP },
          { role: "user", content: MAKE_FIX_JSON_PROMPTS(json) },
        ],
        model,
        temperature,
      });
      if (isJSON(response)) {
        return JSON.parse(response);
      } else {
        throw new Error(`Error calling OpenAI API: ${response}`);
      }
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }
  findPossibleJSON(input: string): string | null {
    const jsonRegex = /({[\s\S]*})/;
    const jsonMatch = input.match(jsonRegex);

    if (jsonMatch) {
      return jsonMatch[1];
    }

    return null;
  }
}

export function isJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
