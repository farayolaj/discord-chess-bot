import { writeFile } from "fs/promises";
import puppeteer from "puppeteer";

/**
 * Create a image of board in given state.
 * @param fen State representation of the chess board in FEN. Defaults to starting state.
 * @param orientation Board orientation according to player. Defaults to white.
 */
export default async function generateBoardImage(
  fen: string,
  orientation: "white" | "black" = "white"
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `file://${process.cwd()}/assets/index.html?position=${encodeURIComponent(
    fen
  )}&orientation=${orientation}`;
  await page.goto(url);
  const board = await page.$("#board");
  const res = await board?.screenshot({
    type: "jpeg",
    quality: 50,
  });

  /* if (res instanceof Buffer) {
    await writeFile("out.webp", res);
  } */
  await browser.close();

  return res as Buffer;
}
/* 
generateBoardImage(
  "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R",
  "black"
); */
