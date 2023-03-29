const apps = require('../../models/application-model.js')

module.exports = {
    name: 'peticion',
    aliases: ['post', 'pl', 'postulacion'],
    async execute(client, msg, args) {

        let code = args[1]
        let reason = args.slice(2).join(" ")
        if (!code) return msg.inlineReply("⚠️ | Faltan argumentos.\nDebes ingresar la opción que deseas usar.\n\n**__Opciones:__**\n- \`seguir\`\n- \`aceptar\`\n- \`denegar\`");
        let findData = await apps.findOne({code: code});
        if (!findData) return msg.inlineReply("> Parece que el código que ingresaste no se encuentra registrado en la base de datos o está mal puesto, inténtalo de nuevo.");
        let member = await msg.guild.members.fetch(findData.id).catch(() => { });
        let staff = await msg.guild.members.fetch(findData.staff).catch(() => { });

        switch (args[0].toLowerCase()) {
            case "seguir":
                if (findData.status === 'En revision' || 'Finalista' && 'Postulado') return msg.inlineReply(`> Esta postulación ya se encuentra **${findData.status}**. El responsable de su aceptación fue **${staff.user.tag}**`)
                let message = await msg.inlineReply(`> El usuario \`${member.user.tag}\` esta por entrar en la segunda etapa de la postulación. ¿Estás seguro de que quieres continuar?`)
                await message.react('✅');
                await message.react('❌');

                setTimeout(async () => { await message.reactions.removeAll().catch(() => { }) }, 30000);
                await message.awaitReactions(async (reaction, user) => {
                    if (user.id !== msg.author.id) return;
                    if (!['✅', '❌'].includes(reaction.emoji.name)) return;
                    if (reaction.emoji.name === '❌') {
                        await message.delete()
                        return;
                    } else {
                        await message.reactions.removeAll().catch(() => { })
                        await message.delete()

                        await findData.updateOne({
                            staff: msg.author.tag,
                            status: "En revision"
                        })
                        await findData.save();

                        await member.send(`Hola **${member.user.username}** 💪,\n\n> Te informo que el departamento responsable del proceso de selección ha actualizado el estado tu postulación, la cual se encuentra **EN REVISIÓN**.\n\n> Te sugerimos ser paciente en la espera de una nueva respuesta.`)
                        return msg.inlineReply(`👀 | Se le va informado al usuario \`${member.user.tag}\` sobre el proceso de su postulación.`)
                    }
                })
                break;
            case "aceptar":
                if (!reason) return msg.inlineReply("> Necesitas dar una razón por la cual aceptar esta postulación.")
                if (findData.status === 'Postulado') return msg.inlineReply("> No puedes aceptar a alguien sin primer haber pasado por la revisión.")
                if (findData.status === 'Finalista') return msg.inlineReply(`> Esta postulación ya fue aceptada por **${staff.user.tag}**.`)

                let mds = await msg.inlineReply(`> A continuación el usuario \`${member.user.tag}\` estará entrando en la anteúltima fase de la postulación escrita, esto quiere decir que se encuentra apto para dicha prueba. \n\n> Razón de la aprobación: \`${reason}\`\n> **¿Estás seguro que quieres hacer esto?**`)
                await mds.react('✅');
                await mds.react('❌');

                setTimeout(async () => { await mds.reactions.removeAll().catch(() => { }) }, 30000);
                await mds.awaitReactions(async (reaction, user) => {
                    if (user.id !== msg.author.id) return;
                    if (!['✅', '❌'].includes(reaction.emoji.name)) return;
                    if (reaction.emoji.name === '❌') {
                        await mds.delete()
                        return;
                    } else {
                        await mds.reactions.removeAll().catch(() => { })
                        await mds.delete()

                        await findData.updateOne({
                            staff: msg.author.id,
                            reason: reason,
                            status: "Finalista"
                        })
                        await findData.save();

                        await member.roles.add("834583013995053086");
                        await member.send(`Hey **${member.user.username}** 😎,\n\n> Acabas de ser seleccionado para la segunda fase de la postulación, esto quiere decir que se te ha otorgado un rol temporal en el servidor, donde los miembros de dicho departamento te informen lo que tienes que hacer para continuar.\n\n**__Este es el nuevo canal en el que tienes acceso__** <#834590155221631016>`)
                        return msg.inlineReply(`📥 | Se le va informado al usuario \`${member.user.tag}\` sobre el proceso de su postulación.`)
                    }
                })
                break;
            case "denegar":
                if (!reason) return msg.inlineReply("> Necesitas dar una razón por la cual denegar esta postulación.")

                if (findData.status === 'Postulado') {
                    return msg.inlineReply("> No puedes aceptar a alguien sin primer haber pasado por la revisión.")
                } else if (findData.status === 'Postulado') {
                    return msg.inlineReply(`> Esta postulación ya fue aceptada por **${staff.user.tag}**.`)
                }

                await findData.updateOne({
                    staff: msg.author.id,
                    reason: reason,
                    status: "Finalista"
                })
                await findData.save();

                await member.send(`Hola **${member.user.username}**,\n\n> Te informamos que el departamento responsable del proceso de selección no ha considerado tu postulación para la vacante.`)
                await msg.inlineReply(`📤 | Denegación de la postulación al usuario \`${member.user.tag}\` por la razón ${reason}. Se le ha informado al privado sobre dicha actualización.`)
                break;
            default:
                break;
        }
    }
}