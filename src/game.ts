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
  private history: string[];

  constructor(
    whiteId: string,
    blackId: string,
    eventCb: (data: GameEventData) => void,
    history?: string[]
  ) {
    this.black = { id: blackId, colour: "black" };
    this.white = { id: whiteId, colour: "white" };
    this.currentPlayer = this.white;
    this.gameClient = Chess.create({ PGN: true });
    this.altChess = new ChessJs();
    this.history = [];

    if (history) {
      this.initializeState(history);
    }

    this.gameClient.on("move", async (move) => {
      const nextPlayer = this.getNextPlayer();

      await eventCb({
        move,
        player: nextPlayer,
        nextPlayer: this.currentPlayer,
        message: `Move made: ${move.algebraic}`,
        type: "MoveEvent",
      });
    });
  }

  /**
   * Initialize board state from given PGN history
   * @param history Array of PGN moves
   */
  private initializeState(history: string[]) {
    for (const [idx, move] of history.entries()) {
      const player = idx % 2 === 0 ? this.white : this.black;
      this.makeMove(move, player.id);
    }
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
      this.history.push(move)

      this.currentPlayer =
        this.currentPlayer.colour === "white" ? this.black : this.white;

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

  /**
   * Get history of all moves made
   * @returns Array of PGN moves
   */
  getHistory() {
    return this.history;
  }
}

export default Game;
