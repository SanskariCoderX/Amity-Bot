// Import necessary classes from discord.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const token = "MTMwNDc2MDE4MjAxODAxNTMxMw.GmWi24.31stTLO5eeW7Pns2oIGbuEC75gud8FcjQpPgEQ";
  // Import the bot token from config.json
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

// Initialize the client with necessary intents
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// Create a collection for the commands
client.commands = new Collection();

// Read and load all command files from the 'commands' folder
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Set up the event when the bot logs in
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Handle command interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    
    if (!command) return;

    try {
        // Execute the command's functionality
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log the bot in using the token from config.json
client.login(token);
