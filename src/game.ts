import Chess, { AlgebraicGameClient, Move, Square } from "chess";
import { Chess as ChessJs, ChessInstance } from "chess.js";
import InvalidMoveError from "./errors/InvalidMove";
import OutOfTurnError from "./errors/OutOfTurn";

interface BaseEventData {
  /** Player that made the move that emitted this event */
  player: Player;
  /** The next player */
  nextPlayer: Player;
  message: string;
}

interface MoveEventData extends BaseEventData {
  move: Move;
  type: "MoveEvent";
}
interface AttackEventData extends BaseEventData {
  attackingSquare: Square;
  kingSquare: Square;
  type: "AttackEvent";
}
interface PromoteEventData extends BaseEventData {
  square: Square;
  type: "PromoteEvent";
}

export type GameEventData = MoveEventData | AttackEventData | PromoteEventData;

export interface Player {
  id: string;
  colour: "black" | "white";
}

/**
 * This class holds game state and logic.
 * <em>It should never be tightly integrated with any platform</em>
 */
class Game {
  readonly white: Player;
  readonly black: Player;
  private currentPlayer: Player;
  private gameClient: AlgebraicGameClient;
  private altChess: ChessInstance;
  private eventCb: (data: GameEventData) => void;

  constructor(
    whiteId: string,
    blackId: string,
    eventCb: (data: MoveEventData | AttackEventData | PromoteEventData) => void
  ) {
    this.black = { id: blackId, colour: "black" };
    this.white = { id: whiteId, colour: "white" };
    this.currentPlayer = this.white;
    this.gameClient = Chess.create({ PGN: true });
    this.altChess = new ChessJs();
    this.eventCb = eventCb;

    this.gameClient.on("move", async (move) => {
      const nextPlayer = this.getNextPlayer();

      await this.eventCb({
        move,
        player: this.currentPlayer,
        nextPlayer: nextPlayer,
        message: `Move made: ${move.algebraic}`,
        type: "MoveEvent",
      });
      this.currentPlayer =
        this.currentPlayer.colour === "white" ? this.black : this.white;
    });
  }

  /**
   * Get next player
   * @returns Next player
   */
  getNextPlayer() {
    return this.currentPlayer.colour === "white" ? this.black : this.white;
  }

  /**
   * Make a chess move using PGN
   * @param move Chess move in PGN
   */
  makeMove(move: string, player: string) {
    const currentPlayer = this.currentPlayer;
    const nextPlayer = this.getNextPlayer();

    if (currentPlayer.id !== player)
      throw new OutOfTurnError({
        currentPlayer,
        nextPlayer,
        move,
      });

    try {
      const res = this.gameClient.move(move);
      this.altChess.move(move);
      return {
        move: res.move,
        player: currentPlayer,
        nextPlayer: nextPlayer,
      };
    } catch (error) {
      throw new InvalidMoveError({
        currentPlayer,
        nextPlayer,
        move,
      });
    }
  }

  /**
   * Get board state in FEN
   * @returns Board state in FEN
   */
  getState() {
    return this.altChess.fen();
  }

  /**
   * Get current player
   * @returns Current player
   */
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  /**
   * Get number of moves made
   * @returns Number of moves since the match started
   */
  getMoveCount() {
    return this.altChess.history().length;
  }
}

export default Game;
