const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js');

const Shift = require('../models/Shift')
const Adjustment = require('../models/Adjustment')

const getGuildSettings = require('../scripts/getGuildSettings');
const getIndividualTimes = require('../scripts/getIndividualTimes');

// https://bobbyhadz.com/blog/javascript-convert-milliseconds-to-hours-minutes-seconds
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    // hours = hours % 24;

    // return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    return `${hours} Hours ${minutes} Minutes and ${seconds} seconds.`;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('data')
        .setDescription('Return time clocked since start of current time period.'),
    async execute(interaction) {

        // Get/set variables
        let settings = await getGuildSettings.getGuildSettings(interaction.guild.id)
        startDate = settings.previous_time_close
        endDate = new Date()
        guild_id = interaction.guild.id
        ds_id = interaction.member.id
        ds_nick = interaction.member.nickname

        currentTimes = await getIndividualTimes.getIndividualTimes(guild_id, ds_id, startDate, endDate)

        // check if any times were returned
        if (currentTimes.length === 0) {
            // Create and send embed
            embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(`${ds_nick} Time since ${startDate}`)
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
            message = message.concat(`**${specialty}** - ${timeString}\n`)
        })

        // Create and send embed
        embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle(`${ds_nick} Time since ${startDate}`)
            .setDescription(message)                
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}