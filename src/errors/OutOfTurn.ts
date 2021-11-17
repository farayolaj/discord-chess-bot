import GameError, { ErrorData } from "./GameError";

class OutOfTurnError extends GameError {
  constructor(data: ErrorData) {
    super({ ...data, message: "Move made out of turn" });
    this.name = "OutOfTurnError";
  }
}

export default OutOfTurnError;
