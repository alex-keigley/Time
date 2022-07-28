// This command returns a list of everyone currently clocked in.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Member = require('../models/Member')
const {getGuildSettings} = require('../scripts/getGuildSettings')
const {convertMsToTime} = require('../scripts/convertMsToTime')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clocked-in')
		.setDescription('See everyone currently clocked in.'),
	async execute(interaction) {

        // Get guild settings and variables
        settings = await getGuildSettings(interaction.guild.id)
        role_id = settings.clocked_in_role_id

        // Get data of all clocked in members
        const clockedInMembers = await getMembers(await getIDs(interaction))

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
                shiftString = convertMsToTime(member.shift_length)
                message = message.concat(`**${member.name}** - ${member.specialty}\n*${shiftString}*\n`)
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

// Retrieve all member IDS with given role
async function getIDs(interaction) {
    const m = await interaction.guild.roles.fetch(role_id)
        .then(role => role.members.map(member => member.id))
    return(m)
}

// get member time info
async function getMembers(id_list) {
    membersClockedIn = []
    await id_list.forEach((id => {
        Member.findOne({ ds_id: id }, (err, member) => {

            // Calculate time since clock-in
            shift_length = new Date().getTime() - member.current_shift.start_time

            // Create member object with name, shift_length, and current specialty
            membersClockedIn.push({
                name: member.ds_nick,
                shift_length: shift_length,
                specialty: member.current_shift.specialty
            })
        })
    }))

    return new Promise((resolve) => {
        setTimeout(() => resolve(membersClockedIn), 300)
    })
}