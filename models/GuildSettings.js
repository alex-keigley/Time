const mongoose = require('mongoose')

const GuildSettingsSchema = new mongoose.Schema({
    guild_id: String,
    clock_channel_id: String,
    clocked_in_role_id: String,
    clock_manager_role: String,
    default_specialty: String,
    specialities: Array
})

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema)