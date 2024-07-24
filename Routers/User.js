const express = require('express')
const app = express()
const User = require('../User/User')
const connection = require("../Database/database")
const Categories = require('../Categories/Categories')
const bcrypt = require('bcrypt');
const { where } = require('sequelize')

app.get('/verify', (req, res) => {
    console.log(req.session.user)
})

app.get('/New', async (req, res) => {
    res.render('User/New')
})

app.post('/Save', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    bcrypt.hash(password, 10, function (err, hash) {
        User.create({
            user: username,
            email,
            password: hash,
            status: 0
        })
        return res.redirect('/browser')
    });

})

app.get('/Login', (req, res) => {
    res.render('User/Login')
})

app.post('/Authenticate', (req, res) => {
    const username = req.body.username
    User.findOne({ where: { user: username } }).then(User => {
        if (User) {
            bcrypt.compare(req.body.password, User.password, function (err, result) {
                if (result) {
                    req.session.user = {
                        id: User.id,
                        username: User.user,
                        email: User.email,
                        status: User.status
                    }
                    return res.redirect('/browser')
                }
                return res.redirect('/User/Login')
            });
        }
        
    })
})

module.exports = app