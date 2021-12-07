import InvalidMoveError from "../errors/InvalidMove";
import OutOfTurnError from "../errors/OutOfTurn";
import Game from "../game";

describe("Game", () => {
  it("initializes to correct state given PGN history", () => {
    const history = [
      "h4",
      "h6",
      "g4",
      "h5",
      "gxh5",
      "g5",
      "hxg5",
      "Rxh5",
      "Rxh5",
      "Nh6",
      "Rxh6",
      "f5",
      "g6",
      "f4",
      "g7",
      "f3",
      "g8=Q",
    ];

    const game = new Game("white", "black", () => {}, history);

    expect(game.getState()).toEqual(
      "rnbqkbQ1/ppppp3/7R/8/8/5p2/PPPPPP2/RNBQKBN1 b Qq - 0 9"
    );
  });

  it("initializes to starting state if no given state", () => {
    const game = new Game("white", "black", () => {});

    expect(game.getState()).toEqual(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    );
  });

  it("accepts valid moves", () => {
    const game = new Game("white", "black", () => {});
    game.makeMove("Nc3", "white");
    game.makeMove("e5", "black");

    expect(game.getState()).toEqual(
      "rnbqkbnr/pppp1ppp/8/4p3/8/2N5/PPPPPPPP/R1BQKBNR w KQkq e6 0 2"
    );
  });

  it("throws if player is not next", () => {
    const game = new Game("white", "black", () => {});
    game.makeMove("Nc3", "white");

    expect(() => game.makeMove("e4", "white")).toThrowError(OutOfTurnError);
  });

  it("throws on correct, but invalid move", () => {
    const game = new Game("white", "black", () => {});
    game.makeMove("Nc3", "white");

    expect(() => game.makeMove("e4", "black")).toThrowError(InvalidMoveError);
  });

  it("throws on incorrect move", () => {
    const game = new Game("white", "black", () => {});
    game.makeMove("Nc3", "white");

    expect(() => game.makeMove("rubbish", "black")).toThrowError(
      InvalidMoveError
    );
  });

  it("calls callback on valid move", () => {
    const cbMock = jest.fn((eventData) => {
      expect(eventData.type).toBe("MoveEvent");
    });

    const game = new Game("white", "black", cbMock);
    game.makeMove("Nc3", "white");

    expect(cbMock.mock.calls.length).toEqual(1);
  });

  it("returns correct history", () => {
    const history = [
      "h4",
      "h6",
      "g4",
      "h5",
      "gxh5",
      "g5",
      "hxg5",
      "Rxh5",
      "Rxh5",
      "Nxh6",
      "Rxh6",
      "f5",
      "g6",
      "f4",
      "g7",
      "f3",
      "g8=Q",
    ];

    const game = new Game("white", "black", () => {}, history);

    expect(game.getHistory()).toEqual(history);
  });
});
