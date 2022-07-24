// Returns all hours ever clocked in

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
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

        // iterate through grouped object and print records
        for await (const doc of s) {
            console.log(doc)
        }
        
    },
}