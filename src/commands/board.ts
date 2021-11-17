import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CacheType,
  CommandInteraction,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import cache from "../cache";
import generateBoardImage from "../generate-board-image";
import logger from "../logger";

export const data = new SlashCommandBuilder()
  .setName("board")
  .setDescription("Get image of board state");

export async function execute(interaction: CommandInteraction<CacheType>) {
  await interaction.deferReply();

  const channelId = interaction.channelId;
  const game = cache.get(channelId);

  if (!game) {
    await interaction.editReply(
      "There is no active game in this channel. Start a new game."
    );
    return;
  }

  const senderId = interaction.user.id;

  try {
    const state = game.getState();
    const image = await generateBoardImage(
      state,
      senderId === game.black.id ? "black" : "white"
    );
    const imageAttachment = new MessageAttachment(image, "board.jpg");
    const moveCount = game.getMoveCount();
    const imageEmbed = new MessageEmbed()
      .setTitle(
        `Board state after ${moveCount} move${moveCount === 1 ? "" : "s"}`
      )
      .setImage(`attachment://${imageAttachment.name}`);

    await interaction.editReply({
      embeds: [imageEmbed],
      files: [imageAttachment],
    });
  } catch (error) {
    logger.error(error);
    await interaction.editReply("An unknown error occured. Try again.");
  }
}
