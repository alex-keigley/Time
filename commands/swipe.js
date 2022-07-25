// This command handles the logic of clocking in and out.

const { SlashCommandBuilder } = require('@discordjs/builders');
const Member = require('../models/Member')
const Shift = require('../models/Shift')
const GuildSettings = require('../models/GuildSettings')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('swipe')
		.setDescription('Toggle clocked-in status.')
        .addStringOption(option => 
            option
                .setName('specialty')
                .setDescription('Choose what specialty to clock-in to.')
            ),
	async execute(interaction) {

        async function getSettings(guild_id) {
            GuildSettings.findOne({ guild_id: guild_id }, (err, settings) => {
                if (err) {
                    console.log(err)
                    interaction.reply('An error occured while trying to check clocked in members.')
                    return;
                }
                guildSettings = settings            
            })
            return new Promise((resolve) => {
                setTimeout(() => resolve(guildSettings), 300)
            })
        }

        // Preparing variables
        settings = await getSettings(interaction.guild.id)
        const role_id = settings.clocked_in_role_id
        const member = interaction.member;                                     // Stores info of person who ran command
        const clockedIn = interaction.member.roles.cache.has(role_id);         // Checks if member has the On Duty role
        const allSpecialties = settings.specialities
        const specialty = interaction.options.getString('specialty')

        // Check if passed in specialty exists
        // if null set to default value
        // else if invalid prompt user to try again
        validSpecialty = allSpecialties.includes(specialty)
        console.log(validSpecialty)

        // CLOCK-IN LOGIC
        if (!clockedIn) {

            // Add On-Duty Role
            member.roles.add(role_id)

            // Update member in DB to begin current shift
            Member.findOne( {ds_id: member.id}, (err, db_member) => {

                // Return error and exit command
                if (err) {
                    console.log(err)
                    interaction.reply('An error occured while trying to clock-in')
                    return;
                }

                // Create new shift object
                new_shift = {
                    ds_id: member.id,
                    guild_id: interaction.guild.id,
                    start_time: new Date().getTime()
                }

                // Adds member to DB, if not found
                if (!db_member){
                    db_member = new Member({
                        ds_id: member.id,
                        guild_id: interaction.guild.id,
                        ds_name: member.user.username,
                        ds_discriminator: member.user.discriminator,
                        ds_nick: member.displayName,
                        current_shift: new_shift
                    })
                }
                // Updates found member
                else {
                        db_member.ds_nick = member.displayName,
                        db_member.current_shift = new_shift
                }

                // Save the new/updated member
                db_member.save(err => {

                    // Throw an error and exit command if needed
                    if (err) {
                        console.log(err)
                        interaction.reply('An error occured while trying to clock-in')
                        return;
                    }

                    // Confirms to user they clocked in
                    interaction.reply(`${member} has clocked in.`);
                })
            })
        } 
        
        // CLOCK-OUT LOGIC
        else {

            // Remove On-Duty Role
            member.roles.remove(role_id)

            // Temporary closing current shift
            // Update member in DB to begin current shift
            Member.findOne( {ds_id: member.id}, (err, db_member) => {

                // Return error and exit command
                if (err) {
                    console.log(err)
                    interaction.reply('An error occured while trying to clock-in')
                    return;
                }

                // Create end time & calculate total length in milliseconds
                end_time = new Date().getTime()
                total_length = end_time - db_member.current_shift.start_time

                // Create new shift object
                new_shift = {
                    ds_id: db_member.ds_id,
                    guild_id: db_member.guild_id,
                    start_time: db_member.current_shift.start_time,
                    end_time: end_time,
                    total_length: total_length
                }

                // Save ended shift to database
                Shift.create(new_shift)

                // Removes shift that just ended from member
                db_member.current_shift = {}

                // Save the new/updated member
                db_member.save(err => {

                    // Throw an error and exit command if needed
                    if (err) {
                        console.log(err)
                        interaction.reply('An error occured while trying to clock-in')
                        return;
                    }

                    // Confirms to user they clocked in
                    interaction.reply(`${member} has clocked out.`);
                })
            })
        }		
	},
};