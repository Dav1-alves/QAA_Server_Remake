const express = require('express')
const app = express()

app.get('/new', (req, res) => {
    res.send('Categories / sub')
})

module.exports = app