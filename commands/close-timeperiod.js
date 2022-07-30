// Return data for all members with clocked hour in time period

// Discordjs packages
const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js')
const { EmbedBuilder } = require('discord.js');

// DB Models
const GuildSettings = require('../models/GuildSettings')

// Other imports
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const {checkTimeAdmin} = require('../scripts/checkTimeAdmin')
const {getGuildSettings} = require('../scripts/getGuildSettings');
const {getAllTimes} = require('../scripts/getAllTimes');
const {getClockInMembers} = require('../scripts/getClockInMembers')
const {swipe} = require('../scripts/swipe')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close-timeperiod')
		.setDescription('Close the current time period.'),
	async execute(interaction) {

        // Make sure user is a Time or Discord admin before running command
        adminStatus = await checkTimeAdmin(interaction)
        if (adminStatus) {
            interaction.reply('You do not have permission to use this command') 
            return
        };

        // Setting up variables
        let settings = await getGuildSettings(interaction.guild.id)
        guild_id = settings.guild_id
        expectedMinutes = settings.expected_total_time
        lastClose = settings.previous_time_close
        // currentTime = new Date()
        // newClose = currentTime.setSeconds(currentTime.getSeconds() + 10)

        // Hard-coded dates for developing/troubleshooting
        lastClose = new Date('2022-05-01')
        newClose = new Date('2022-08-03')

        // Handle if guild has never closed a time period
        if (!lastClose) {
            // Immediatly update settings and close function
            GuildSettings.updateOne(
                { guild_id: guild_id }, 
                { previous_time_close: newClose },
                (err) => {
                    if (err) {
                        console.log(err)
                        interaction.reply('There was an error closing the time period.')
                        return;
                    }
            })
            return
        }

        // // Get all members currently clocked in & clock them out
        rawFinalTimes = await swipeThenRead(interaction)

        // convert milliseconds to minutes
        finalTimes = rawFinalTimes.map(obj => {
            minutes = Math.floor(obj.time / 60000)
            return {...obj, time: minutes}
        })

        // Create the new csv
        const csvWriter = createCsvWriter({
            path: './cache/time_period.csv',
            header: [
                {id: 'ds_id', title:'DISCORD_ID'},
                {id: 'name', title:'NAME'},
                {id: 'specialty', title:'SPECIALTY'},
                {id: 'time', title:'MINUTES'}
            ]
        })
        csvWriter.writeRecords(finalTimes)

        // Update last-closed date in guild settings
        GuildSettings.updateOne(
            { guild_id: guild_id }, 
            { previous_time_close: newClose },
            (err) => {
                if (err) {
                    console.log(err)
                    interaction.reply('There was an error closing the time period.')
                    return;
                }
            }
        )

        // Prepare variables for report
        allStaffTime = finalTimes.reduce((total, obj) => obj.time + total,0)                // Total minutes for all members

        // Total minutes for each member
        memberTotalTimes = []
        finalTimes.reduce((res, value) => {
            if (!res[value.ds_id]) {
                res[value.ds_id] = { ds_id: value.ds_id, name: value.name, time: 0 }
                memberTotalTimes.push(res[value.ds_id])
            }
            res[value.ds_id].time += value.time
            return res
        }, {})

        // Find members with minutes < expectedMinutes
        underTimeMessage = ''
        memberTotalTimes.forEach((member) => {
            if (member.time < expectedMinutes) {
                underTimeMessage = underTimeMessage.concat(`${member.name} only clocked ${member.time} minutes.\n`)
            }
        })

        if (underTimeMessage == ''){
            underTimeMessage = 'All members achieved expected times.'
        }

        // Create time-frame message
        timeFrameMessage = `Start: \`${lastClose}\` \n End:\`${newClose}\``
         
        // Reply to user with file
        file = new AttachmentBuilder()
            .setFile('./cache/time_period.csv')
        
        embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle(`Report for closed time period:`)
            .setDescription(`A grand total of \`${allStaffTime}\` minutes were clocked.`)
            .addFields(
                { name: `Clocked time under \`${expectedMinutes}\` minutes:`, value: underTimeMessage },
                { name: 'Time Period', value: timeFrameMessage }
            )

        try {
            interaction.reply({
                files: [file],
                embeds: [embed]
            })  
        } catch {
            interaction.reply('There was an error closing the time period.')
        }

     
    },
}

// Swipe all members in list
async function swipeMembers(interaction, memberList) {
    let result = true
    for await (const member of memberList) {
        m = await interaction.guild.members.fetch(member.ds_id)
        result = swipe(interaction, m, member.specialty, false)
    }
    return result
}

// Swipe all members, then read updated DB
async function swipeThenRead(interaction) {

    // Get all members currently clocked in & clock them out
    const clockedInMembers = await getClockInMembers(interaction)
    f = await swipeMembers(interaction, clockedInMembers)

    rawFinalTimes = await getAllTimes(guild_id, lastClose, newClose)

    return new Promise((resolve) => {
        setTimeout(() => resolve(rawFinalTimes), 300)
    })

}
