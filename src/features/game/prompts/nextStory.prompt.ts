import { CharacterState } from "src/common/interfaces/game.interfaces";

import { toCharacterStateString } from "./game.prompt";

export const SYSTEM_INTRO = (theme: string) =>
  `You are an AI language model, and your task is to generate a new story segment based on the information I provide. Make the story interesting, engaging, and consistent with the details provided. The theme is "${theme}".`;
export function MAKE_NEW_CHARACTER_STATE_PROMPT(params: {
  character: CharacterState;
  theme: string;
  storySegment: string;
  option: string;
  nextStorySegment: string;
}) {
  const characterInfo = toCharacterStateString(params.character);

  return `You are an AI character state generator. Based on the following information, generate the updated character state as a JSON object.
    
      Theme: "${params.theme}"
      
      Last story segment: ${params.storySegment}
      
      Next story segment: ${params.nextStorySegment}
    
      Current character state: ${characterInfo}
    
      Player action: ${params.option}
    
      Updated character state:`;
}
