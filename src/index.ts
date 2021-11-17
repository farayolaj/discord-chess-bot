import { Client, Intents } from "discord.js";
import commands from "./commands";
import { token } from "./config";
import logger from "./logger";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  logger.info("Client is ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    try {
      const command = commands.get(interaction.commandName);

      if (!command) {
        await interaction.reply(
          "Command is yet to be implemented. Sorry about this."
        );
      } else {
        command.execute(interaction);
      }
    } catch (err) {
      logger.error(err);
    }
  }
});

client.on("debug", (msg) => logger.debug(msg));
client.on("warn", (msg) => logger.warn(msg));
client.on("error", (err) => logger.error(err));

process.on("unhandledRejection", (error) => {
  logger.error(error);
});

client.login(token);
