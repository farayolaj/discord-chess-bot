import { italic, SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Get help on using ChessBot.");

export async function execute(interaction: CommandInteraction<CacheType>) {
  await interaction.reply(
    `Slash Commands:
    /start ${italic("user1")} ${italic(
      "user2"
    )} - Start a game with user1 playing white and user2 playing black
    /move ${italic(
      "pgnMove"
    )} - Make a move using [Algebraic Notation](https://wikipedia.org/wiki/Algebraic_notation_(chess))
    /board - Get image of board state
    /cancel - Cancel the current game
    `
  );
}
