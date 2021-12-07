import generateBoardImage from "../generate-board-image";

describe("Generate Chess Board Image", () => {
  it("generates board image given correct parameters", async () => {
    const result = await generateBoardImage(
      "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R"
    );
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(40000);
  });
});
