import { REST } from "@discordjs/rest";
import {
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord-api-types/v9";
import { clientId, guildId, token } from "./config";
import commandMap from "./commands";
import logger from "./logger";

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

for (const command of commandMap.values()) {
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    logger.info("Started refreshing application (/) commands.");

    if (process.env.NODE_ENV === "production")
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
    else
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });

    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error(error);
  }
})();
