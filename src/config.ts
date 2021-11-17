import dotenv from "dotenv";

dotenv.config();

export const clientId = process.env.CLIENT_ID as string;
export const token = process.env.TOKEN as string;
export const guildId = process.env.GUILD_ID as string;
