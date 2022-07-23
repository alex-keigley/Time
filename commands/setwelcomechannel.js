const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionsBitField } = require('discord.js')
const GuildSettings = require('../models/GuildSettings')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomechannel')
        .setDescription('Set the welcome message channel.')
        .addChannelOption(option => option
            .setName('welcome')
            .setDescription('The channel to set as the welcome channel.')
            .setRequired(true)
        ),
    async execute(interaction) {
        
        // Check for admin perms
        if (!interaction.member.permissions.has([PermissionsBitField.Administrator])) {
            interaction.reply('You do not have permission to use this command.');
            return;
        }

        // Adds or modified guild settings - done with setttings variable
        GuildSettings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log(err)
                interaction.reply('An error occured while trying to set the welcome channel.')
                return;
            }

            // Adds discord server to DB if not already in it
            if (!settings) {
                settings = new GuildSettings({
                    guild_id: interaction.guild.id,
                    welcome_channel_id: interaction.options.getChannel('welcome').id
                })
            } else {
                settings.welcome_channel_id = interaction.options.getChannel('welcome').id
            }

            // Save and confirm new welcome channel has been set
            settings.save(err => {
                if (err) {
                    console.log(err)
                    interaction.reply('An error occured while trying to set the welcome channel.')
                    return;
                }

                interaction.reply(`Welcome channel has been set to ${interaction.options.getChannel('welcome')}`)
            })
        })

    }
}