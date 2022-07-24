// This command returns a list of everyone currently clocked in.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Member = require('../models/Member')




module.exports = {
	data: new SlashCommandBuilder()
		.setName('clocked-in')
		.setDescription('See everyone currently clocked in.'),
	async execute(interaction) {
		
        // get member ids
        async function getIDs() {
            const m = await interaction.guild.roles.fetch('886855569930072084')
                .then(role => role.members.map(member => member.id))
            return(m)
        }

        console.log(await getIDs())

        // get member info

        // create embed
    },
}