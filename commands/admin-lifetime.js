const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js');

const {getIndividualTimes} = require('../scripts/getIndividualTimes');
const {convertMsToTime} = require('../scripts/convertMsToTime');
const {checkTimeAdmin} = require('../scripts/checkTimeAdmin')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin-lifetime')
        .setDescription('Return time clocked of user since start of this bot.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Member to retrieve data for.')
                .setRequired(true)
            ),
    async execute(interaction) {

        // Make sure user is a Time or Discord admin before running command
        adminStatus = await checkTimeAdmin(interaction)
        if (adminStatus) {
            interaction.reply('You do not have permission to use this command') 
            return
        };

        // Get/set variables
        startDate = new Date('2022-07-01')                // Start time is before bot existed, therefore before any data existed
        endDate = new Date()
        guild_id = interaction.guild.id
        ds_id = interaction.options.getMember('member').id
        ds_nick = interaction.options.getMember('member').nickname

        // Get total of time clocked by specialty since last time-period close
        currentTimes = await getIndividualTimes(guild_id, ds_id, startDate, endDate)

        // check if any times were returned
        if (currentTimes.length === 0) {
            // Create and send embed
            embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(`${ds_nick} - Current Totals`)
                .setDescription('No time clocked this time period.')                
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return
        }

        // Prepare message
        let message = ''
        currentTimes.forEach((time) => {
            specialty = time.specialty
            milliseconds = time.time
            timeString = convertMsToTime(milliseconds)
            message = message.concat(`${specialty} - *${timeString}*\n`)
        })

        // Create and send embed
        embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle(`${ds_nick} - Lifetime Totals`)
            .setDescription(message)                
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}
