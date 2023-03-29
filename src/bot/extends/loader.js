const { Collection } = require('discord.js');
const fs = require('fs');

module.exports = (client) => {
    client.commands = new Collection();

    const events = fs.readdirSync('./src/bot/events/').filter(file => file.endsWith('.js'));
    const commands = fs.readdirSync('./src/bot/commands/').filter(files => files.endsWith('.js'));
    
    for (const file of events) {
        const event = require(`../events/${file}`);
        client.on(file.split('.')[0], event.bind(null, client));
    };
    
    for (const file of commands) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
}