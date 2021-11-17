import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Get help on using ChessBot.");

export async function execute(interaction: CommandInteraction<CacheType>) {
  await interaction.reply(
    "I'll be able to help you later. But now, I'm unable to help"
  );
}
