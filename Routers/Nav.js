const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.render('./Nav/index')
})

app.get('/profile', (req, res) => {
    res.send('profile')
})

module.exports = app