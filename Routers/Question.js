const express = require('express')
const app = express()
const connection = require("../Database/database")

app.get('/:id', (req, res) => {
    const id = req.params.id
})


module.exports = app