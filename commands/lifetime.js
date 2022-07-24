// Returns all hours ever clocked in

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Shift = require('../models/Shift')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lifetime')
		.setDescription('Return all hours clocked since implementation'),
	async execute(interaction) {

        async function getTotalTime(id) {

            // Total time in millliseconds
            totalTime = 0

            Shift.find({ ds_id: id }, (err, shifts)  => {
                shifts.forEach((shift => {
                    totalTime += shift.total_length
                }))    
            })

            return new Promise((resolve) => {
                setTimeout(() => resolve(totalTime), 300)
            })
        }
        
		totalTime = await getTotalTime(interaction.member.id)
        
        // Do caluclations to display fancy time string
        var date = new Date(totalTime)
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()

        const timeString = `${hours} hours ${minutes} minutes and ${seconds} seconds`

        // Create embed
        embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle(`${interaction.member.nickname} - Lifetime Hours`)
            .setDescription(timeString)

        interaction.reply({embeds: [embed]})
        
    },
}