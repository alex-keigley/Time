// This command returns a list of everyone currently clocked in.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clocked-in')
		.setDescription('See everyone currently clocked in.'),
	async execute(interaction) {
		
		// Getting all users with the Clocked-in role
		interaction.guild.roles.fetch('886855569930072084')
			.then(role => {

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