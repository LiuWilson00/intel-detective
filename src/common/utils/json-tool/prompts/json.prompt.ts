export const GAME_START_SYSTEM_PROMPTS =
  "A highly experienced and skilled dungeon master";
// "A seasoned dungeon master in Dungeons & Dragons or tabletop RPGs.";
// "A highly experienced and skilled dungeon master"
// "A masterful storyteller in the world of tabletop RPGs"
// "An expert in creating immersive game worlds and crafting epic adventures"
// "A veteran of countless campaigns and battles in the world of Dungeons & Dragons"
export const SESSION_JSON_TRANSFORM_PROMPT = `
You are a JSON converter, you will convert the text I provided into JSON format, JSON please follow the following specifications:
The JSON format for the text adventure game includes two main parts: "content" and "player".
The "content" object includes three fields: "content", "options", and "note".
1."content": This field represents the current situation or event in the game. It may include background story, descriptions, or dialogues.
2."options": This field contains an array of options that the player can choose from. Each option has three attributes: "index", "content", and "destination". "Index" is an integer representing the order of the option. "Content" is a string representing the text of the option. "Destination" is a string representing the identifier of the next event or situation in the game.
3."note": This field is optional and can be used to provide additional information or instructions to the player.
The "player" object includes seven fields: "name", "hp", "mp", "Profession", "skill", "items", "status", and "ability".
1."name": This field is a string representing the name of the player.
2."hp": This field is an integer representing the current hit points of the player.
3."mp": This field is an integer representing the current magic points of the player.
4."Profession": This field is a string representing the profession or class of the player.
5."skill": This field is an array of strings representing the skills or abilities of the player.
6."items": This field is an array of strings representing the items in the player's inventory.
7."status": This field is an array of strings representing the status effects on the player.
8."ability": This field is an object containing three attributes: "str", "int", and "agi". "Str" is an integer representing the strength ability of the player. "Int" is an integer representing the intelligence ability of the player. "Agi" is an integer representing the agility ability of the player.
`;
export const SESSION_JSON_TRANSFORM_PROMPT_LITE = `You need to convert the provided text into JSON format according to the following specifications:The JSON format for a text adventure game has two parts: "content" and "player". The "content" object has three fields: "content", "options", and "note". "Content" represents the current situation or event in the game. "Options" contains an array of choices with an index, content, and destination. "Note" is optional and provides additional information. The "player" object has seven fields: "name", "hp", "mp", "profession", "skill", "items", "status", and "ability". The fields represent the player's name, health points, magic points, profession, skills, items, status effects, and abilities.`;

export const SESSION_JSON_TRANSFORM_EXMPLE = `
{
  "content": {
  "content": "You find yourself in a dark room with a single torch burning on the wall. The room is small and cramped, with a wooden chest in the corner. You hear a faint sound coming from the other side of the door.",
  "options": [
  {
  "index": 0,
  "content": "Open the chest",
  "destination": "chest"
  },
  {
  "index": 1,
  "content": "Approach the door",
  "destination": "door"
  }
  ],
  "note": "You can use your strength ability to break down the door."
  },
  "player": {
  "name": "John",
  "hp": 80,
  "mp": 50,
  "Profession": "Fighter",
  "skill": ["Power Strike", "Shield Bash"],
  "items": ["Health Potion"],
  "status": ["Poisoned"],
  "ability": {
  "str": 12,
  "int": 8,
  "agi": 10
  }
  }
  }
`;

export const SESSION_JSON_TRANSFORM_EXMPLE_LITE = `{
  "content": {
  "content": "You're in a dark room with a torch on the wall, a chest in the corner, and a sound from the other side of the door.",
  "options": [
  {"index": 0, "content": "Open the chest", "destination": "chest"},
  {"index": 1, "content": "Approach the door", "destination": "door"}
  ],
  "note": "Use your strength to break down the door."
  },
  "player": {
  "name": "John",
  "hp": 80,
  "mp": 50,
  "profession": "Fighter",
  "skill": ["Power Strike", "Shield Bash"],
  "items": ["Health Potion"],
  "status": ["Poisoned"],
  "ability": {"str": 12, "int": 8, "agi": 10}
  }
  }`;

const JSON_TRANSFORM_NOTE =
  "Note: 1.According to the JSON specification, double quotes within double quotes should be replaced with single quotes 2.There cannot be any double quotes between two double quotes.";

export const JSON_TRANSFORM_SYSTEM_PROMP = "You are a clever JSON converter";
export const FIX_JSON_SYSTEM_PROMP = "You are a clever JSON fixer";
const FIX_JSON_PROMPT = (
  note: string
) => `You are a JSON fixer,The input JSON does not conform to the specification, please help me fix it.${note}
  input:`;

export function MAKE_GAME_SESSION_JSON_TRANSFORM_PROMPTS(input: string) {
  return `${SESSION_JSON_TRANSFORM_PROMPT}\nexmple:\n${SESSION_JSON_TRANSFORM_EXMPLE}\n${JSON_TRANSFORM_NOTE}\nInput:${input}\nOutput:`;
}
export function MAKE_GAME_SESSION_JSON_TRANSFORM_PROMPTS_LITE(input: string) {
  return `${SESSION_JSON_TRANSFORM_PROMPT_LITE}\nexmple:\n${SESSION_JSON_TRANSFORM_EXMPLE_LITE}\n${JSON_TRANSFORM_NOTE}\nInput:${input}\nOutput:`;
}

export function MAKE_FIX_JSON_PROMPTS(input: string) {
  return FIX_JSON_PROMPT(JSON_TRANSFORM_NOTE) + input + "\noutput:";
}

const _SESSION_JSON_TRANSFORM_PROMPT_V2_ORIGINAL = `
This JSON is a data structure used for a text adventure game, describing the story content and character status in the game. The JSON has two main parts:

"round": represents the current round's story content and options. The "story" attribute describes the current round's story plot, while the "options" attribute is an array containing the action options that the player can take. When a player enters a new round, the "round" should display the story content and options, and wait for the player's selection. The "interactable" attribute is an array that contains all the interactive objects in the game. Players can interact with these objects.

"state": represents the player's character status. The "HP" and "MP" attributes represent the player's health and mana points, while the "available_items" and "available_skills" attributes represent the player's available items and skills. The "strength", "dexterity", and "wisdom" attributes represent the player's three basic attributes. In addition, the "occupation" attribute represents the player's profession, and the "equipment" attribute is an object used to store the type and related attributes of the player's current equipment. Finally, the "money" attribute represents the player's current amount of money.

In the game, the player's character status changes as the game progresses, such as the player acquiring money by defeating enemies, gaining new items or skills, and so on. When the player's character status changes, the corresponding attribute values in the "state" should be updated to reflect the latest status. In the game, players can interact with the objects listed in the "interactable" attribute by choosing an interaction option to interact with the object.`;

// const SESSION_JSON_TRANSFORM_PROMPT_V2 = `You are a clever JSON converter,
// This JSON is used for a text adventure game and has two main parts:
// "round" describes the current round's story and the options available to the player. Players can interact with the objects listed in the "interactable" attribute.
// "state" describes the player's character status, including health, available items and skills, attributes, occupation, equipment, and money. The player's status changes throughout the game, and corresponding values in "state" are updated accordingly.`;

// const JSON_TRANSFORM_NOTE_V2 = `Note: To follow JSON specifications, double quotes inside double quotes should be replaced with single quotes, and there cannot be double quotes between two double quotes.`;

// export function MAKE_GAME_SESSION_JSON_TRANSFORM_PROMPTS_V2(input: string) {
//   return `${SESSION_JSON_TRANSFORM_PROMPT_V2}\n${JSON_TRANSFORM_NOTE_V2}\nInput:${input}\nOutput:`;
// }

const SESSION_JSON_TRANSFORM_PROMPT_V2 = `You are a clever JSON converter for a text adventure game. Your task is to convert the given input into a JSON output that strictly follows the structure of GameStateDTO, which is composed of two main parts: "round" and "state".

The "round" part contains:
- "story": a string
- "options": an array of objects, each with "description" and "action" properties (both strings)
- "interactable": an array of strings (item names)

The "state" part contains:
- "health": a number
- "mana": a number
- "items": an array of strings
- "skills": an array of strings
- "attributes": an object with "strength", "dexterity", and "wisdom" properties (all numbers)
- "status": an array of strings
- "occupation": a string
- "equipment": an object with "head", "body", "legs", "hands", "feet", "weapon", and "shield" properties (all strings)
- "money": a number

Make sure to follow JSON specifications for quotes and format.`;

const JSON_TRANSFORM_NOTE_V2 = `Note: Use single quotes instead of double quotes inside double quotes, and avoid having double quotes between two double quotes. Ensure that the output is stable and matches the DTO structure.`;

export function MAKE_GAME_SESSION_JSON_TRANSFORM_PROMPTS_V2(input: string) {
  return `${SESSION_JSON_TRANSFORM_PROMPT_V2}\n${JSON_TRANSFORM_NOTE_V2}\nInput:${input}\nOutput:`;
}
