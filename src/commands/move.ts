import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import {
  CacheType,
  CommandInteraction,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import cache from "../cache";
import InvalidMoveError from "../errors/InvalidMove";
import OutOfTurnError from "../errors/OutOfTurn";
import generateBoardImage from "../generate-board-image";
import logger from "../logger";

export const data = new SlashCommandBuilder()
  .setName("move")
  .setDescription("Make a valid move using PGN.")
  .addStringOption((builder) =>
    builder.setName("move").setDescription("A valid PGN move").setRequired(true)
  );

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

  const moveStr = interaction.options.getString("move", true);
  const senderId = interaction.user.id;

  try {
    const { player, nextPlayer } = game.makeMove(moveStr, senderId);
    const state = game.getState();
    const image = await generateBoardImage(state, nextPlayer.colour);

    const imageAttachment = new MessageAttachment(image, "board.jpg");
    const imageEmbed = new MessageEmbed().setImage(
      `attachment://${imageAttachment.name}`
    );

    await interaction.editReply({
      files: [imageAttachment],
      embeds: [imageEmbed],
      content: `${userMention(
        player.id
      )} has made their move. It is ${userMention(nextPlayer.id)}'s turn.`,
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof InvalidMoveError) {
      await interaction.editReply("This is an invalid move. Make a new one.");
    } else if (error instanceof OutOfTurnError) {
      const currentPlayer = game.getCurrentPlayer();

      await interaction.editReply(
        `${userMention(senderId)} played out of turn. It is ${userMention(
          currentPlayer.id
        )}'s (${currentPlayer.colour}) turn.`
      );
    } else {
      await interaction.editReply("An unknown error occured. Try again.");
    }
  }
}
