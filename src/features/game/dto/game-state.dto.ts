interface InteractableObject {
  id: number;
  name: string;
  description: string;
}

export interface CharacterState {
  health: number;
  mana: number;
  items: string[];
  skills: string[];
  attributes: {
    strength: number;
    dexterity: number;
    wisdom: number;
  };
  status: string[];
  occupation: string;
  equipment: {
    head: string;
    body: string;
    legs: string;
    hands: string;
    feet: string;
    weapon: string;
    shield: string;
  };
  money: number;
  gender: string;
  name: string;
}
interface GameOption {
  description: string;
  action: string;
}

interface GameRound {
  story: string;
  options: GameOption[];
  interactable: InteractableObject[];
}

export class GameStateDTO {
  round: GameRound;
  state: CharacterState;

  constructor(round: GameRound, state: CharacterState) {
    this.round = round;
    this.state = state;
  }
}
