const GuildSettings = require('../models/GuildSettings')
const { PermissionsBitField } = require('discord.js')


// Get time management role
async function getClockManagerRole(guild_id) {
    let role_id = 0
    GuildSettings.findOne({ guild_id: guild_id }, (err, settings) => {
        if (err) {
            console.log(err)
            interaction.reply('An error occured while trying to check clocked in members.')
            return;
        }
        role_id = settings.clock_manager_role            
    })

    return new Promise((resolve) => {
        setTimeout(() => resolve(role_id), 300)
    })
}

async function checkTimeAdmin(interaction) {
    // return 'File reached'    
    
    clockManagerRole = await getClockManagerRole(interaction.guild.id)

    // Check for Time management or admin perms
    // if ( !(interaction.member.roles.cache.has(clockManagerRole) || interaction.member.permissions.has([PermissionsBitField.Flags.Administrator]))) {
    //     interaction.reply('You do not have permission to use this command.');
    //     return;
    // }
    adminStatus = !(interaction.member.roles.cache.has(clockManagerRole) || interaction.member.permissions.has([PermissionsBitField.Flags.Administrator]))
    return adminStatus
}

exports.checkTimeAdmin = checkTimeAdmin;