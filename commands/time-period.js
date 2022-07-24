// Returns all hours ever clocked in

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const Shift = require('../models/Shift')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time-period')
		.setDescription('By individual, return all hours clocked in a specific timeframe.')
        .addStringOption( (option) => 
            option
                .setName('start-date')
                .setDescription('Start date for lookup, enter as YYYY-MM-DD')
                .setRequired(true)
        )
        .addStringOption( (option) => 
            option
                .setName('end-date')
                .setDescription('End date for lookup, enter as YYYY-MM-DD')
                .setRequired(true)
        ),
	async execute(interaction) {

        // Convert date string to Date object
        async function getDate(dateString) {
            const date = await new Date(dateString)

            return new Promise((resolve) => {
                setTimeout(() => resolve(date), 300)
            })
        }

        // Convert inputted dates to Unix Date objects
        const startDate = await getDate(interaction.options.getString('start-date'))
        const endDate = await getDate(interaction.options.getString('end-date'))

        // Group all shifts in time period by discord ID
        const s = Shift.aggregate([
            { $match: { start_time: { $gte: startDate }, end_time: { $lte: endDate } }},
            { $group: {
                _id: '$ds_id',
                total_time: { $sum: '$total_length'}
            }},
            { $lookup: {                                        // LEFT JOIN with the Members table
                from: 'members',
                localField: '_id',
                foreignField: 'ds_id',
                pipeline: [                                     // WHERE - Selects which columns to join
                    { $project: {name: '$ds_nick'}}
                ],
                as: 'member_info'                               // Name of joined object
            }}
        ]);

        // Prepare list of objects to write to csv
        csvRecords = []
        for await (const doc of s) {
            csvRecords.push({
                name: doc.member_info[0].name,
                raw_time: doc.total_time
            })
        }

        // Clear and write header of csv file
        const csvWriter = createCsvWriter({
            path: './cache/time_period.csv',
            header: [
                {id: 'name', title: 'NAME'},
                {id: 'raw_time', title: 'RAW_TIME'}
            ]
        })

        // Write time data to csv
        csvWriter.writeRecords(csvRecords)

        // Read and prepare to send the CSV file
        file = new AttachmentBuilder()
            .setFile('./cache/time_period.csv')

        interaction.reply({files: [file]})
        
    },
}