import GameError, { ErrorData } from "./GameError";

class InvalidMoveError extends GameError {
  constructor(data: ErrorData) {
    super({ ...data, message: "An invalid move was made" });
    this.name = "InvalidMoveError";
  }
}

export default InvalidMoveError;
