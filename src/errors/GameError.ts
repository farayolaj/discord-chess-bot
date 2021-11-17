import { Player } from "../game";

type GameErrorData = {
  message?: string;
  currentPlayer: Player;
  nextPlayer: Player;
  move?: string;
};

export type ErrorData = Omit<GameErrorData, "message">;

class GameError extends Error {
  currentPlayer: Player;
  nextPlayer: Player;
  move?: string;

  constructor(data: GameErrorData) {
    super(data.message);
    this.currentPlayer = data.currentPlayer;
    this.nextPlayer = data.nextPlayer;
    this.move = data.move;
    this.name = "GameError";
  }
}

export default GameError;
