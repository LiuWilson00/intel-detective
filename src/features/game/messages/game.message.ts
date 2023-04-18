import { ChatCompletionRequestMessage } from "openai";

import { CharacterState } from "src/common/interfaces/game.interfaces";
import { LangEnum } from "src/common/types/game.type";
import { toCharacterStateString } from "../prompts/game.prompt";
import { SYSTEM_INTRO } from "../prompts/nextStory.prompt";

export const nextStoryMessage = (
  params: {
    lang: LangEnum;
    character: CharacterState;
    theme: string;
    storySegment: string;
    option: string;
    playerExperience: string[];
  },
  options?: {
    gender: string;
    name: string;
  }
): ChatCompletionRequestMessage[] => {
  const playerExperienceText = params.playerExperience.join("\n\n");
  console.log("playerExperienceText", playerExperienceText);
  const characterInfo = toCharacterStateString(params.character, options);
  console.log("characterInfo", characterInfo);

  return [
    {
      role: "system",
      content: SYSTEM_INTRO(params.theme),
    },
    {
      role: "system",
      content: `Player Experience:\n${playerExperienceText}`,
    },
    {
      role: "system",
      content: `Last Story Segment:\n${params.storySegment}`,
    },
    {
      role: "system",
      content: `Player State:\n${characterInfo}`,
    },
    {
      role: "system",
      content: `Player Action:\n${params.option}`,
    },
    {
      role: "system",
      content: `Next Story Segment:`,
    },
  ];
};
