export interface InteractableObject {
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
export interface GameOption {
  description: string;
  action: string;
}

export interface GameRound {
  story: string;
  options: GameOption[];
  interactable: InteractableObject[];
}

export interface GameState {
  round: GameRound;
  state: CharacterState;
}
