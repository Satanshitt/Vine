const { PREFIX: prefix } = process.env;

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!cmd) return
    if (!cmd.mod && !message.member.roles.cache.some((rol) => ['798026623554682890', '798308695494098955', '798632045675806790', '798026702659649607', '798026844976185406'].includes(rol.id))) return;

    return cmd.execute(client, message, args);
};