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

  it("calls back on valid move", () => {
    const cbMock = jest.fn();

    const game = new Game("white", "black", cbMock);
    game.makeMove("Nc3", "white");

    expect(cbMock).toBeCalledTimes(1);
    expect(cbMock).toBeCalledWith(
      expect.objectContaining({
        type: "MoveEvent",
      })
    );
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

  it("calls back on check attack", () => {
    const history = [
      "e4",
      "e6",
      "d4",
      "d5",
      "e5",
      "c5",
      "c3",
      "Nc6",
      "Nf3",
      "Nge7",
      "a4",
      "Bd7",
      "dxc5",
      "Ng6",
      "b4",
      "Be7",
      "Be3",
      "a5",
      "b5",
      "Ncxe5",
      "Nxe5",
      "Nxe5",
      "Nd2",
      "Qc7",
      "Nb3",
      "O-O",
      "Be2",
      "Nc4",
      "Bxc4",
      "dxc4",
      "Nd2",
      "e5",
      "c6",
      "Be6",
      "Qe2",
      "bxc6",
      "b6",
      "Qb7",
      "O-O",
      "Rad8",
      "Ne4",
      "Rd5",
      "Qxc4",
      "c5",
      "Qe2",
      "Qxb6",
      "Rfb1",
      "Qc6",
      "Qb5",
      "Qa8",
      "c4",
    ];
    const cbMock = jest.fn();

    const game = new Game("white", "black", cbMock, history);
    game.makeMove("Rd1+", "black");

    expect(cbMock).toBeCalledTimes(2);
    expect(cbMock).toBeCalledWith(
      expect.objectContaining({ type: "AttackEvent", isCheckMate: false })
    );
  });

  it("calls back on checkmate attack", () => {
    const history = [
      "e4",
      "e6",
      "d4",
      "d6",
      "e5",
      "f6",
      "exd6",
      "Qxd6",
      "Nf3",
      "f5",
      "Ng5",
      "Nf6",
      "f4",
      "Qd5",
      "Nxe6",
      "Bxe6",
      "Qh5+",
      "g6",
      "Qxg6+",
      "Kd7",
      "Qxh7+",
      "Nxh7",
      "Kd2",
      "Bc5",
      "Kc3",
    ];
    const cbMock = jest.fn();

    const game = new Game("white", "black", cbMock, history);
    game.makeMove("Qxd4#", "black");

    expect(cbMock).toBeCalledTimes(2);
    expect(cbMock).toBeCalledWith(
      expect.objectContaining({ type: "AttackEvent", isCheckMate: true })
    );
  });
});
