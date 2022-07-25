const { SlashCommandBuilder } = require('@discordjs/builders')
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