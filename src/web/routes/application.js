const express = require('express');
const router = express.Router();

const { create } = require('sourcebin');

const postulation = require('../../models/application-model.js');

router.post("/comunidad/postulacion", async (req, res) => {
    let random = Math.random().toString(36).substring(3)

    const {
        name, years, region, gender, nameMC,
        section_one_question_1, section_one_question_2, section_one_question_3,
        section_two_question_1, section_two_question_2, section_two_question_3, section_two_question_4, section_two_question_5,
        section_three_question_1, section_three_question_2, section_three_question_3, section_three_question_4,
        section_four_question_1, section_four_question_2, section_four_question_3, section_four_question_4,
    } = req.body;

    const channel = await res.app.get('client').channels.cache.get('823674062567112764')
    const member = await req.app.get('client').guilds.cache.get('798011003022344253').members.fetch(req.session.user.id)

    if (years < 15) {
        req.flash('danger', 'Parece que no cumples con la edad minima requerida.')
        res.redirect('/comunidad/postulacion');
        return false
    }

    if (member) {
        let data = `
        Código: ${random}\n
        ID de Discord: ${member.user.id} (${member.user.tag})

        \n\nDatos personales.\n\nNombre: ${name}\nEdad: ${years}\nNacionalidad: ${region}\nUsuario de Minecraft: ${nameMC}\nGenero: ${gender}

        \n\n1. Sector cero - Persona\n\nPregunta #1: ${section_one_question_1}\nPregunta #2: ${section_one_question_2}\nPregunta #3: ${section_one_question_3}

        \n\n2. Sector uno - Servidor\n\nPregunta #1: ${section_two_question_1}\nPregunta #2: ${section_two_question_2}\nPregunta #3: ${section_two_question_3}\nPregunta #4: ${section_two_question_4}\nPregunta #5: ${section_two_question_5}
        \n\n3. Sector dos - Comunidad\n\nPregunta #1: ${section_three_question_1}\nPregunta #2: ${section_three_question_2}\nPregunta #3: ${section_three_question_3}\nPregunta #4: ${section_three_question_4}
        \n\n4. Sector tres - Equipo\n\nPregunta #1: ${section_four_question_1}\nPregunta #2: ${section_four_question_2}\nPregunta #3: ${section_four_question_3}\nPregunta #4: ${section_four_question_4}`

        const content = await create(
            {
                title: `Postulación de ${member.user.tag}`,
                description: 'Respuestas de postulación a MineFastia Network.',
                files: [
                    {
                        content: data,
                        language: 'text',
                    },
                ],
            },
        );

        let message = await channel.send({
            embed: {
                color: "YELLOW",
                author: {
                    name: 'Nueva postulación 🔔',
                },
                description: `Enviada por el usuario \`${member.user.tag}\`.`,
                fields: [
                    {
                        name: 'Visualizar las respuestas',
                        value: `[Ir al link](${content.url} "Clic para abrir el link")`,
                    },
                    {
                        name: 'Código de referencia',
                        value: `\`${random}\``,
                    },
                ]
            }
        });

        /*let application = new postulation({
            id: member.user.id,
            code: random,
            messageID: message.id
        });

        await member.send(`Buenas estimado **${member.user.username}** 👋\n\n> Te aviso que se ha recibido un informe tuyo al servidor de MineFastia, lo cual estamos complacidos de tener a alguien que se haya tomado el tiempo en postularse en nuestra comunidad.\n\n> Se te estará informando sobre el proceso de tu postulación en la brevedad, muchas gracias por su tiempo.\n\n__Estado de la postulación__: **POSTULADO**`).catch(async () => {
            req.flash('message', `¡Ey, ${member.user.username}! te informo que se le han enviado tus respuestas al departamento de trabajo correctamente.`)
            req.flash('info', `Recuerda activar los mensajes privados para saber cual es la respuesta a tu postulación.`)
            await application.save()
            return false
        })*/

        await channel.send(message)

        req.flash('message', `¡Te has postulado con exito, ${member.user.username}! te informo que se le han enviado tus respuestas al departamento de trabajo correctamente.`)
        req.flash('info', `Recuerda que el personal puede tomarse un tiempo para dar una respuesta, lo cual no te desesperes y sé paciente.`)
        /*await application.save()*/
        res.redirect('/')
    }
});

module.exports = router;