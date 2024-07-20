const express = require('express')
const app = express()

app.get('/:id', (req, res) => {
    const id = req.params.id
})


module.exports = app