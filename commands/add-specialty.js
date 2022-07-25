const { SlashCommandBuilder } = require('@discordjs/builders')
const GuildSettings = require('../models/GuildSettings')

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
        newSpecialty = interaction.options.getString('specialty')
        
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