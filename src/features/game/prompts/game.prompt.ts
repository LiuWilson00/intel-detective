import { CharacterState } from "src/common/interfaces/game.interfaces";
import { LangEnum } from "src/common/types/game.type";
import { Occupation } from "src/common/utils/game-tool/interfaces/occupations.interface";

export function toCharacterStateString(
  characterState: CharacterState,
  options: {
    gender?: string;
    name?: string;
  } = {}
): string {
  const items = characterState.items?.length
    ? characterState.items.join(", ")
    : "no items";
  const skills = characterState.skills?.length
    ? characterState.skills.join(", ")
    : "no skills";
  const status = characterState.status?.length
    ? characterState.status.join(", ")
    : "no status effects";

  const equipment = Object.entries(characterState.equipment)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const _gender = options?.gender ?? characterState.gender ?? "Male";
  const _name = options?.name ?? characterState.name ?? "Player";

  return `
${_name}, a ${_gender}, 
has the following character state:
- occupation: ${
    typeof characterState.occupation === "string"
      ? characterState.occupation
      : "Adventurer"
  }
- Health: ${characterState.health}
- Mana: ${characterState.mana}
- Items: ${items}
- Skills: ${skills}
- Attributes:
  - Strength: ${characterState.attributes.strength}
  - Dexterity: ${characterState.attributes.dexterity}
  - Wisdom: ${characterState.attributes.wisdom}
- Status: ${status}
- Equipment: ${equipment}
- Money: ${characterState.money}
`;
}
export function MAKE_GAME_START_PROMPTS_V3(params: {
  lang: LangEnum;
  name: string;
  character: CharacterState;
  theme: string;
}) {
  const characterInfo = toCharacterStateString(params.character);
  return `Create a text adventure game with the theme "${params.theme}" for the player, providing an engaging and interactive experience. Set the game in a world that fits the theme, and weave a rich narrative for the player to explore. Ensure that the game relies on the player's input for actions and decisions, and only progresses when the player provides input.

Initial state: ${characterInfo}

Keep in mind:
1. Do not make any choices or progress the story without the player's input.
2. Always wait for the player's input before presenting the consequences of their actions or providing new options.
3. Provide actionable options for players to choose from.
4. Always include the updated character state after each round of the game, describing the consequences of the player's actions on their character.
5. Be a well-trained dungeon master, offering interesting options and situations for the player.

Now, start the game in the ${params.lang} language. Remember to pause the game after each decision point, and wait for the player's input to continue.`;
}

export function USER_SELECT_PROMPTS(input: string) {
  return `User chooses ${input}.Note:1. Be sure to describe the current state of the user.2. Be sure to give users options.3. If you encounter a battle, please describe the result of each point after rolling the dice, and wait for the user to roll the dice.`;
}

export const GAME_START_SYSTEM_PROMPTS =
  "A highly experienced and skilled dungeon master";

export const CHARACTER_CREATION_PROMPT = (
  occupation: Occupation | string,
  name: string,
  gender: string
) => {
  const occupationInfo =
    typeof occupation === "string"
      ? occupation
      : `{name:${occupation.name},description:${occupation.description}}, initialSkills:${occupation.initialSkills}, stars: ${occupation.stars}}`;

  return `Based on the following occupation description, create a character named ${name} with gender ${gender}, and an initial state, including health, mana, items, skills, attributes (strength, dexterity, wisdom), status, occupation, equipment, and money.
    
    Occupation description: ${occupationInfo}
    
    Please only provide a JSON object as output. Make sure to start your output with "Output:" followed by the JSON object. The JSON object should follow the format below:
    {
      health: <number>,
      mana: <number>,
      items: [<item1>, <item2>, ...],
      skills: [<skill1>, <skill2>, ...],
      attributes: {
        strength: <number>,
        dexterity: <number>,
        wisdom: <number>,
      },
      status: [<status1>, <status2>, ...],
      occupation: <occupation>,
      equipment: {
        head: <head>,
        body: <body>,
        legs: <legs>,
        hands: <hands>,
        feet: <feet>,
        weapon: <weapon>,
        shield: <shield>,
      },
      money: <number>,
      gender: "${gender}",
      name: "${name}",
    }}`;
};

export function MAKE_STORY_PROMPT(params: {
  lang: LangEnum;
  name: string;
  character: CharacterState;
  theme: string;
}) {
  const characterInfo = toCharacterStateString(params.character);
  return `Create a narrative for a text adventure game with the theme "${params.theme}" set in a world that fits the theme. Describe the initial situation and the environment where the player's character finds themselves.

Initial state: ${characterInfo}

The game should be in the ${params.lang} language. Remember to focus on the narrative and avoid presenting any choices or decision points in this prompt.`;
}

export function MAKE_OPTIONS_PROMPT(params: {
  lang: LangEnum;
  character: CharacterState;
  theme: string;
  storySegment: string;
}) {
  const characterInfo = toCharacterStateString(params.character);
  return `Based on the following story segment from a text adventure game, provide 2 to 4 actionable options for the player to choose from. These options should be relevant to the current situation and help the player progress through the story.

Theme: "${params.theme}"
Story segment: ${params.storySegment}

Player state: ${characterInfo}

The options should be in the ${params.lang} language. Remember to focus on providing options and avoid including any story progression or consequences in this prompt.`;
}

export function MAKE_NEXT_STORY_PROMPT(params: {
  lang: LangEnum;
  character: CharacterState;
  theme: string;
  storySegment: string;
  option: string;
  playerExperience: string[];
}) {
  const characterInfo = toCharacterStateString(params.character);
  const playerExperienceText = params.playerExperience.join("\n");

  return `You are a word game generator, I will provide you the player's story experience, you must generate a new story based on the information I provide:
  Theme: "${params.theme}"

  ${
    playerExperienceText != "" ? `playerExperience:${playerExperienceText}` : ""
  }

  last story:${params.storySegment}
 
  Player state: ${characterInfo} 

  Player action:${params.option}
  
  next story:`;
}

export function MAKE_NEXT_CHARACTER_STATE_PROMPT(params: {
  lang: LangEnum;
  character: CharacterState;
  theme: string;
  storySegment: string;
  option: string;
  playerExperience: string[];
}) {
  const characterInfo = toCharacterStateString(params.character);
  const playerExperienceText = params.playerExperience.join("\n");

  return `You are a word game generator, I will provide you the player's story experience, you must generate a new character state based on the information I provide:
  Theme: "${params.theme}"

  ${
    playerExperienceText != "" ? `playerExperience:${playerExperienceText}` : ""
  }

  last story:${params.storySegment}
 
  Player state: ${characterInfo} 

  Player action:${params.option}
  
  next character state:`;
}
