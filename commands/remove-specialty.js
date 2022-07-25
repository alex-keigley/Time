const { SlashCommandBuilder } = require('@discordjs/builders')
const GuildSettings = require('../models/GuildSettings')
const checkTimeAdmin = require('../scripts/checkTimeAdmin')

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

        // Make sure user is a Time or Discord admin before running command
        adminStatus = await checkTimeAdmin.checkTimeAdmin(interaction)
        if (adminStatus) {
            interaction.reply('You do not have permission to use this command') 
            return
        };

        specialty = interaction.options.getString('specialty')
        
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