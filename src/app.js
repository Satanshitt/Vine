const express = require('express');

const fs = require('fs');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');

class App {
    constructor(client, db) {
        this.express = express();
        this.express.set('view engine', 'ejs');
        this.express.set('views', __dirname + '/web/views');

        this.express.set('client', client);

        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(express.static(__dirname + '/web/public'));

        this.express.use(passport.initialize());
        this.express.use(passport.session());

        this.express.use(session({
            secret: 'secret',
            cookie: { maxAge: null },
            resave: false,
            saveUninitialized: false
        }));
        this.express.use(flash());

        this.loadRoutes();
        this.connectMongoDB();
    }

    listen(port) {
        return new Promise((resolve) => this.express.listen(port, resolve))
    }

    loadRoutes() {
        const routes = fs.readdirSync('./src/web/routes/').filter(files => files.endsWith('.js'));

        for (const file of routes) {
            const router = require(`./web/routes/${file.slice(0, -3)}`);

            try {
                this.express.use(router);
            } catch (error) {
                console.error(`Se ha producido un error en la ruta "${file}" (${error})`);
            }
        }
        return this;
    }

    async connectMongoDB() {
        this.mongoose = await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false
        });
        this.connection = this.mongoose.connection;
        console.log(`[MongoDB] Conectado a la base de datos: "${this.connection.name}"`);
    }
}

module.exports = App