import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import {
  CacheType,
  CommandInteraction,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import cache from "../cache";
import Game, { GameEventData } from "../game";
import generateBoardImage from "../generate-board-image";

const getGameEventHandler =
  (interaction: CommandInteraction<CacheType>) => (data: GameEventData) => {
    switch (data.type) {
    }
  };

export const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("Start a new chess game.")
  .addUserOption((builder) =>
    builder
      .setName("white")
      .setDescription("A mentioned user that will play white")
      .setRequired(true)
  )
  .addUserOption((builder) =>
    builder
      .setName("black")
      .setDescription("A mentioned user that will play black")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction<CacheType>) {
  await interaction.deferReply();
  const channelId = interaction.channelId;

  if (cache.has(channelId)) {
    await interaction.editReply(
      "There is an active game in this channel. Finish it up or cancel it to start a new one."
    );
    return;
  }

  const white = interaction.options.getUser("white", true);
  const black = interaction.options.getUser("black", true);

  const game = new Game(white.id, black.id, getGameEventHandler(interaction));
  cache.set(channelId, game);
  const state = game.getState();
  const image = await generateBoardImage(state, "white");

  const imageAttachment = new MessageAttachment(image, "board.jpg");
  const imageEmbed = new MessageEmbed().setImage(
    `attachment://${imageAttachment.name}`
  );

  await interaction.editReply({
    files: [imageAttachment],
    embeds: [imageEmbed],
    content: "Game has been created.",
  });
  await interaction.followUp(`${userMention(white.id)}, you're up first.`);
}
