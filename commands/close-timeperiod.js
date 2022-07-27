// Return data for all members with clocked hour in time period

// Discordjs packages
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js')

// DB Models
const Shift = require('../models/Shift')
const Member = require('../models/Member')
const Adjustment = require('../models/Adjustment')
const GuildSettings = require('../models/GuildSettings')

// Other imports
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const checkTimeAdmin = require('../scripts/checkTimeAdmin')
const getGuildSettings = require('../scripts/getGuildSettings');
const { listIndexes } = require('../models/Shift');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close-timeperiod')
		.setDescription('Close the current time period.'),
	async execute(interaction) {

        // Make sure user is a Time or Discord admin before running command
        adminStatus = await checkTimeAdmin.checkTimeAdmin(interaction)
        if (adminStatus) {
            interaction.reply('You do not have permission to use this command') 
            return
        };

        // Setting up variables
        let settings = await getGuildSettings.getGuildSettings(interaction.guild.id)
        guild_id = settings.guild_id
        lastClose = settings.previous_time_close
        newClose = new Date()

        // Hard-coded dates for developing/troubleshooting
        // lastClose = new Date('2022-05-01')
        // newClose = new Date('2022-05-01')

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
                }
            )
            return
        }

        // Get all shifts since last close
        // Group all shifts in time period by discord ID
        const shifts = Shift.aggregate([
            { $match: { start_time: { $gte: lastClose }, end_time: { $lte: newClose }, guild_id: interaction.guild.id }},
            { $group: {
                _id: {
                    ds_id: '$ds_id',
                    specialty: '$specialty'
                },
                total_time: { $sum: '$total_length'}
            }},
            { $lookup: {                                        // LEFT JOIN with the Members table
                from: 'members',
                localField: '_id.ds_id',
                foreignField: 'ds_id',
                pipeline: [                                     // WHERE - Selects which columns to join
                    { $project: {name: '$ds_nick'}}
                ],
                as: 'member_info'                               // Name of joined object
            }},
            { $sort: {_id : 1} }                                // Sorting by _id
        ]);

        // Format shift totals into a standard format
        let times = []
        for await (const doc of shifts) {
            entry = {
                ds_id: doc._id.ds_id,
                name: doc.member_info[0].name,
                specialty: doc._id.specialty,
                time: doc.total_time
            }
            times.push(entry)
        }        

        // Retrieve and aggregate adjustments since last close
        const adjustments = Adjustment.aggregate([
            { $match: { date: {$gte: lastClose, $lt: newClose}} },
            { $group: {
                _id: {
                    ds_id: '$ds_id',
                    specialty: '$specialty'
                },
                total_time: { $sum: '$total_time' }
            }},
            { $sort: {_id : 1} }
        ])

        // Format adjustment totals into standard format
        timesToAdjust = []
        for await (const doc of adjustments) {
            entry = {
                ds_id: doc._id.ds_id,
                specialty: doc._id.specialty,
                time: doc.total_time
            }
            timesToAdjust.push(entry)
        }

        async function adjustTimes(times, adjustments) {
            // Format and store times
            adjustments.forEach(adjustment => {

                // Track if time total was found
                timeFound = false

                // Find adjustment in totals
                times.every((time, index) => {
                    if (adjustment.ds_id === time.ds_id && adjustment.specialty === time.specialty) {
                        times[index].time = time.time + adjustment.time     // Adjust the time
                        timeFound = true                                    // Used to break execution of lower code
                        return false                                        // Break the loop and move to next adjustment
                    } else return true                                      // Continue loop
                })

                // If adjustment doesn't exist, add entry
                if (!timeFound) {
                    // Get nickname of member
                    Member.findOne({ ds_id: adjustment.ds_id }, (err, member) => {
                        if(err) throw err
                        ds_nick = member.ds_nick;
                        times.push({
                            ds_id: adjustment.ds_id,
                            name: ds_nick,
                            specialty: adjustment.specialty,
                            time: adjustment.time
                        })
                    })
                }            
            })

            // Return updated times array
            return new Promise((resolve) => {
                setTimeout(() => resolve(times), 300)
            })

        }

        // Calculate final time totals for time period
        finalTimes = await adjustTimes(times, timesToAdjust)

        // Sort by discord ID
        finalTimes.sort((a, b) => {
            return a.ds_id - b.ds_id;
        })

        // Create the new csv
        const csvWriter = createCsvWriter({
            path: './cache/time_period.csv',
            header: [
                {id: 'ds_id', title:'DISCORD_ID'},
                {id: 'name', title:'NAME'},
                {id: 'specialty', title:'SPECIALTY'},
                {id: 'time', title:'TIME'}
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