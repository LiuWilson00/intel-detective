import {
  CharacterState,
  GameRound,
} from "src/common/interfaces/game.interfaces";

export class GameStateDTO {
  round: GameRound;
  state: CharacterState;

  constructor(round: GameRound, state: CharacterState) {
    this.round = round;
    this.state = state;
  }
}
