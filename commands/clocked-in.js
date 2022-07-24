// This command returns a list of everyone currently clocked in.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Member = require('../models/Member')
const GuildSettings = require('../models/GuildSettings')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clocked-in')
		.setDescription('See everyone currently clocked in.'),
	async execute(interaction) {

        // get clocked-in role from guild settings
        async function getClockRole(guild_id) {
            let role_id = 0
            GuildSettings.findOne({ guild_id: guild_id }, (err, settings) => {
                if (err) {
                    console.log(err)
                    interaction.reply('An error occured while trying to check clocked in members.')
                    return;
                }
                role_id = settings.clocked_in_role_id                
            })

            return new Promise((resolve) => {
                setTimeout(() => resolve(role_id), 300)
            })
        }

        // get member ids
        role_id = await getClockRole(interaction.guild.id)
        async function getIDs() {
            const m = await interaction.guild.roles.fetch(role_id)
                .then(role => role.members.map(member => member.id))
            return(m)
        }

        // get member info
        async function getMembers(id_list) {
            membersClockedIn = []
            await id_list.forEach((id => {
                Member.findOne({ ds_id: id }, (err, member) => {

                    // Calculate time since clock-in
                    shift_length = new Date().getTime() - member.current_shift.start_time

                    membersClockedIn.push({
                        name: member.ds_nick,
                        shift_length: shift_length
                    })
                })
            }))
        
            return new Promise((resolve) => {
                setTimeout(() => resolve(membersClockedIn), 300)
            })
        }

        const clockedInMembers = await getMembers(await getIDs())

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
                shift_length = new Date(member.shift_length)
                shift_length = shift_length.toISOString().slice(11, 19); // 👉️ 15:00:00
                message = message.concat(`**${member.name}** \n *${shift_length}* \n`)
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