// This command returns a list of everyone currently clocked in.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Member = require('../models/Member')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clocked-in-old')
		.setDescription('See everyone currently clocked in.'),
	async execute(interaction) {
		
		// Getting all users with the Clocked-in role
		interaction.guild.roles.fetch('886855569930072084')
			.then(role => {

				// Start new method integrating DB
				// const member_ids = role.members.map(member => member.id)
				// let membersClockedIn = []
				// console.log(member_ids)

				// // Get current shift info from each member clocked-in
				// member_ids.forEach((id => {
				// 	Member.find({ ds_id: id}, (err, member) => {

				// 		// Calculate time since clock-in
				// 		console.log(member)
				// 		console.log('======================')
				// 		console.log(member['current_shift'])
				// 		// shift_length = new Date().getTime() - member.current_shift.start_time
				// 		shift_length = 100

				// 		membersClockedIn.push({
				// 			name: member.ds_nick,
				// 			shift_length: shift_length
				// 		})
				// 	})
				// }))

				// console.log(`Members clocked in: ${membersClockedIn}`)


				// Start old code
				// Array
				// This method is only used with debugging currently.
				// const memberList = role.members.map(member => member)

				// memberList.forEach((member => {
				// 	console.log(member.nickname)
				// }))
				
				// String of all members, with a new line started for each
				// Will only display members with a nickname
				const members = `${role.members.map(member => member.nickname).join('\n')}`

				// Handle if no-one is clocked in
				if (members.length === 0) {
					embed = new EmbedBuilder()
						.setColor('#1E90FF')
						.setTitle('Clocked in:')
						.setDescription('There is nobody clocked-in.')
					interaction.reply({embeds: [embed] })
				}
				else {
					// Creating embeded messge
					embed = new EmbedBuilder()
					.setColor('#1E90FF')
					.setTitle('Clocked in:')
					.setDescription(members)

					// Replying with embed message
					interaction.reply({embeds: [embed] })
				}
			})
			.catch(console.error);
		
	},
};