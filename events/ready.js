// Standard bot packages
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()

// Api packages
const express = require ('express')
const bodyParser = require('body-parser')
const { apiClockIn } = require('../scripts/apiClockIn')
const { apiClockOut } = require('../scripts/apiClockOut')

const app = express()
app.use(bodyParser.json())

module.exports = {
    name: 'ready',
    once: true,
    execute (client, commands) {
        console.log('Time is online.')

        // Registering the slash commands
        const CLIENT_ID = client.user.id
        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (process.env.ENV === 'production') {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    })
                    console.log('Successfully registered commands globally.')
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commands
                    })
                    console.log('Successfully registered commands locally.')
                    }
            } catch (err) {
                if (err) console.log(err)
            }
        })();

        // Setting up clock-in route
        app.post('/clock-in', async (req, res) => {
            let data = req.body
            apiClockIn(client, data)
            res.status(200).send({ message: 'Clock-in API Reached.' })
        })

        // Setting up clock-out route
        app.post('/clock-out', async (req, res) => {
            let data = req.body
            apiClockOut(client, data)
            res.status(200).send({ message: 'Clock-out API Reached.' })
        })

        // Start express server
        app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))

    }
}