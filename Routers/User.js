const express = require('express')
const app = express()
const User = require('../User/User')
const connection = require("../Database/database")

app.get('/', (req, res) => {
    const Users = User.findAll().then(User => {
        res.json({User})
    })
})


module.exports = app