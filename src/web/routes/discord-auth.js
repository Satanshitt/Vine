const express = require('express');
const router = express.Router();

const passport = require('passport');
const DiscordStrategy = require('passport-discord');

const postulation = require('../../models/application-model.js');

passport.serializeUser(function (user, done) { done(null, user) })
passport.deserializeUser(function (obj, done) { done(null, obj) })

passport.use(new DiscordStrategy({
    clientID: process.env.BOT_CLIENT_ID,
    clientSecret: process.env.BOT_CLIENT_SECRET,
    callbackURL: process.env.BOT_CALLBACK_URL,
    scope: ['identify'],
    prompt: 'consent'
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));

router.get('/authorize', passport.authenticate('discord', {
    scope: ['identify'], prompt: 'consent'
}), function (req, res) { });

router.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    req.session.user = req.user;
    res.redirect('/comunidad/postulacion');
})

router.get('/comunidad/postulacion', async function (req, res) {
    if (!req.session.user) return res.redirect('/authorize');

    let findData = await postulation.findOne({
        id: req.session.user.id
    });

    if (findData) {
        req.flash('error', `Ya te encuentras postulado en el servidor. Tu postulacion ahora mismo se encuentra *${findData.status}*`)
        res.redirect('/')
        return false;
    }

    let member = await req.app.get('client').guilds.cache.get('798011003022344253').members.fetch(req.session.user.id).catch(async () => {
        req.flash('error', 'Parece que no te encuentras en el servidor de Discord, ingresa primero antes de volver a solicitar la postulacion.')
        res.redirect('/')
        return false;
    })
    
    if (member.roles.cache.has("798026844976185406")) {
        req.flash('error', 'Ya eres parte del departamento de bienestar.')
        res.redirect('/')
        return false
    }

    res.render('postulations', {
        user: req.session.user,
        danger: req.flash('danger')
    })
})

module.exports = router;