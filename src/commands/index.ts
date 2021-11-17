import { SlashCommandBuilder } from "@discordjs/builders";
import Collection from "@discordjs/collection";
import { CacheType, CommandInteraction } from "discord.js";
import fs from "fs";
import path from "path";

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
};

const commands = new Collection<string, Command>();
const baseDir = path.join(process.cwd(), "src", "commands");

// Dynamically get all commands in the directory
const commandFiles = fs
  .readdirSync(baseDir)
  .filter((path) => path.endsWith(".ts") && !path.includes("index"))
  .map((path) => path.slice(0, path.length - 3));

for (const file of commandFiles) {
  const command: Command = require(path.join(baseDir, file));
  commands.set(command.data.name, command);
}

export default commands;
