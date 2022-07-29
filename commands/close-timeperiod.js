// Return data for all members with clocked hour in time period

// Discordjs packages
const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js')

// DB Models
const GuildSettings = require('../models/GuildSettings')

// Other imports
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const {checkTimeAdmin} = require('../scripts/checkTimeAdmin')
const {getGuildSettings} = require('../scripts/getGuildSettings');
const {getAllTimes} = require('../scripts/getAllTimes');

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
        lastClose = settings.previous_time_close
        newClose = new Date()

        // Hard-coded dates for developing/troubleshooting
        lastClose = new Date('2022-05-01')
        newClose = new Date('2022-09-01')

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

        // get sum of shifts - adjustments of all members
        rawFinalTimes = await getAllTimes(guild_id, lastClose, newClose)

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

        // Reply to user with file
        file = new AttachmentBuilder()
            .setFile('./cache/time_period.csv')

        interaction.reply({
            content: `**Time Period:** \n Start: \`${lastClose}\` \n End:\`${newClose}\``,
            files: [file]
        })        
       
    },
}