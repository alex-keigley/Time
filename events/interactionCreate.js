module.exports = {
    name: 'interactionCreate',
    once: true,
    async execute (interaction) {
        // Check if interaction is a command
        if (!interaction.isChatInputCommand()) return;
        
        // Check if command exists
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) return;

        try {
            await command.execute(interaction)
        } catch(err) {
            if (err) console.log(err);
            await interaction.reply({
                content: 'An error occurred while executing that command.',
                ephemeral: true        // Only shows the user running the command the error
            })
        }
    }
}