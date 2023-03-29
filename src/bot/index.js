const Discord = require('discord.js')
const client = new Discord.Client()

require('./extends/loader')(client);
require('./extends/message')

module.exports.init = async (token) => {
    client.userBaseDirectory = __dirname;
    await client.login(token);
    return client;
}