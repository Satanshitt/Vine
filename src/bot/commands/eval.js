const Discord = require('discord.js');

module.exports = {
    name: 'eval',
    aliases: ['e', 'evaluar', 'dev'],
    async execute(client, msg, args) {

        if(!["517023704681545748", "686766483350880351", "293839740342632468"].includes(msg.author.id)) return msg.inlineReply("caca");
        if (!args[0]) return;
        try {
            let evaluation = await eval(args.join(' ').includes('await') ? ('(async () => { ' + args.join(' ') + ' })();') : args.join(' '));
            const type = typeof(evaluation);
            if (typeof(evaluation) !== 'string') evaluation = require('util').inspect(evaluation, { depth: 0 });
            return msg.inlineReply(`[${type.toTitleCase()}] '${Date.now() - msg.createdTimestamp}ms'\n${evaluation.replace(process.env.DISCORD_TOKEN, '...').replace(process.env.DATABASE_URI, '...')}`, { code: 'js' });
        } catch(err) {
            return msg.inlineReply(`Ocurrió un error, ${msg.author.tag}.\nTipo: ${err.name || 'Error Desconocido'}\nDetalles: ${err.message || err}`.slice(0, 1980), { code: 'js' });
        }
    }
}