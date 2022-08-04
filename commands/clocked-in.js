// This command returns a list of everyone currently clocked in.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Member = require('../models/Member')
const {getGuildSettings} = require('../scripts/getGuildSettings')
const {convertMsToTime} = require('../scripts/convertMsToTime')
const {getClockInMembers} = require('../scripts/getClockInMembers')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clocked-in')
		.setDescription('See everyone currently clocked in.'),
	async execute(interaction) {

        // Get guild settings and variables
        settings = await getGuildSettings(interaction.guild.id)
        role_id = settings.clocked_in_role_id

        // Get data of all clocked in members
        const clockedInMembers = await getClockInMembers(interaction)

        // Handle if nobody is clocked in
        if (clockedInMembers.length === 0) {
            embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle('Clocked in:')
                .setDescription('There is nobody clocked-in.')
            interaction.reply({embeds: [embed] })
        }
        else {
            // create description text for embed
            let message = ''
            clockedInMembers.forEach((member => {
                currentTime = new Date().getTime()
                shift_length = currentTime - member.current_shift.start_time
                shiftString = convertMsToTime(shift_length)
                message = message.concat(`**${member.ds_nick}** - ${member.current_shift.specialty}\n*${shiftString}*\n\u200B\n`)
            }))

            // create and send embed
            embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle('Clocked in:')
                .setDescription(message)                
            interaction.reply({embeds: [embed]})
        }
    },
}