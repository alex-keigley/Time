// This command handles the logic of clocking in and out.

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('swipe')
		.setDescription('Toggle clocked-in status.'),
	async execute(interaction) {

        const member = interaction.member;                                                  // Stores info of person who ran command
        const clockedIn = interaction.member.roles.cache.has('886855569930072084');         // Checks if member has the On Duty role

        // Checks if member is clocked out
        if (!clockedIn) {   // Member is off-duty, so clock-in
            
            // Remove Off-Duty Role
            // member.roles.remove('886855474706808892')

            // Add On-Duty Role
            member.roles.add('886855569930072084')

            // Send confirmation message
            await interaction.reply(`${member} has clocked in.`);

        } else {        // Member is currently on-duty, so clock-out

            // Remove On-Duty Role
            member.roles.remove('886855569930072084')

            // Add Off-Duty Role
            // member.roles.add('886855474706808892')

            // Send confirmation message
            await interaction.reply(`${member} has clocked out.`);

        }		
	},
};