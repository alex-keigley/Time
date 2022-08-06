const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionsBitField } = require('discord.js')
const GuildSettings = require('../models/GuildSettings')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-specialty')
        .setDescription('Remove specialty to be clocked in to.')
        .addStringOption( (option) =>
            option
                .setName('specialty')
                .setDescription('Specicialty category to remove from guild settings')
                .setRequired(true)
    ),
    async execute(interaction) {

        // Only checks for Discord Admin role
        if ( !interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
            interaction.reply('You do not have permission to use this command.');
            return;
        }

        // Get input passed in from user
        specialty = interaction.options.getString('specialty').toUpperCase()
        
        // Add new specialty to list
        GuildSettings.updateOne(
            { guild_id: interaction.guild.id },
            { $pull: { specialities: specialty } },
            (err) => {
                if (err) {
                    console.log(err)
                    interaction.reply('There was an error removing the specialty.')
                    return;
                }
                interaction.reply(`${specialty} has been removed from available specialities.`)
            }
        )


    }
}