import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("Pong!");
}

// import { CommandInteraction, SlashCommandBuilder } from "discord.js";
//
// export const data = new SlashCommandBuilder()
//     .setName("System")
//     .setDescription("Starts gpt chat instance with System");
//
// export async function execute(interaction: CommandInteraction) {
//     console.log('@@ interaction', interaction);
//     return interaction.reply("Pong!");
// }
