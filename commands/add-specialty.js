const { SlashCommandBuilder } = require('@discordjs/builders')
const GuildSettings = require('../models/GuildSettings')
const checkTimeAdmin = require('../scripts/checkTimeAdmin')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-specialty')
        .setDescription('Add specialty to be clocked in to.')
        .addStringOption( (option) =>
            option
                .setName('specialty')
                .setDescription('Specicialty category to add to guild settings')
                .setRequired(true)
    ),
    async execute(interaction) {

        // Make sure user is a Time or Discord admin before running command
        adminStatus = await checkTimeAdmin.checkTimeAdmin(interaction)
        if (adminStatus) {
            interaction.reply('You do not have permission to use this command') 
            return
        };

        newSpecialty = interaction.options.getString('specialty').toUpperCase()
        
        // Add new specialty to list
        GuildSettings.updateOne(
            { guild_id: interaction.guild.id },
            { $addToSet: { specialities: newSpecialty } },
            (err) => {
                if (err) {
                    console.log(err)
                    interaction.reply('There was an error adding the new specialty.')
                    return;
                }
                interaction.reply(`${newSpecialty} has been successfully added to available specialities.`)
            }
        )
    }
}