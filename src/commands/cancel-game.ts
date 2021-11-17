import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import cache from "../cache";
import logger from "../logger";

export const data = new SlashCommandBuilder()
  .setName("cancel")
  .setDescription("Cancel an ongoing game");

export async function execute(interaction: CommandInteraction<CacheType>) {
  await interaction.deferReply();

  const channelId = interaction.channelId;
  const game = cache.get(channelId);

  if (cache.has(channelId)) {
    try {
      cache.delete(channelId);

      await interaction.editReply(
        "Game has been cancelled. You can start a new game."
      );
    } catch (error) {
      logger.error(error);
      await interaction.editReply("An unknown error occured. Try again.");
    }
  } else {
    await interaction.editReply(
      "There is no active game in this channel. Start a new game."
    );
    return;
  }
}
