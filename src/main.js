require("module-alias/register");
require('dotenv').config();

const bot = require('@bot/index');
const App = require('./app');
const port = process.env.PORT || '8001';

(async () => {

    let client = await bot.init(process.env.TOKEN);
    
    await new App(client).listen(port);
    console.log(`[Server] Servidor conectado al puerto ${port}`);
})()