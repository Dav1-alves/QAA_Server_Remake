const express = require('express');
const app = express();
const User = require('../User/User');
const connection = require("../Database/database");
const Categories = require('../Categories/Categories');
const subCategories = require('../Categories/subCategories/subCategories');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const session = require('express-session');
require('dotenv').config();

app.get('/New', (req, res) => {
    res.render('User/New');
});

app.post('/Save', async (req, res) => {
    const { username, email, password } = req.body;

    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            return res.status(500).send('Erro ao salvar usuário');
        }
        User.create({
            user: username,
            email: email,
            password: hash,
            status: 0
        }).then(() => {
            res.redirect('/browser');
        }).catch(error => {
            res.status(500).send('Erro ao criar usuário');
        });
    });
});

app.get('/Login', (req, res) => {
    res.render('User/Login');
});

app.get('/QRcode', (req, res) => {
    res.render('User/QRcodeMob', { user: req.session.user });
});

app.post('/Authenticate', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { user: username } });

    if (!user) {
        return res.redirect('/User/Login');
    }

    if (password == "") {
        var email = user.email
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(200).render('User/MagicLink')

        console.log(`${process.env.BASE_URL}/User/MagicLink/${token}`)

    } else {
        bcrypt.compare(password, user.password, function (err, result) {

            if (result) {
                req.session.user = {
                    id: user.id,
                    username: user.user,
                    email: user.email,
                    status: user.status
                };
                return res.redirect('/browser');
            } else {
                return res.redirect('/User/Login');
            }

        });
    }
});

app.get('/MagicLink/:token', (req, res) => {

    const { token } = req.params;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado');
        }

        await User.findOne({ where: { email: decoded.email } }).then(user => {

            req.session.user = {
                id: user.id,
                username: user.user,
                email: user.email,
                status: user.status
            };

        });

        return res.redirect('/browser');

    });
});

module.exports = app;
