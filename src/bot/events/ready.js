module.exports = async (client) => {
    console.log(`[Bot] Sesión iniciada en ${client.user.tag}`);
    await client.user.setActivity({name: 'el procesamiento de los datos de MineFastia.', type: 'WATCHING'})
};