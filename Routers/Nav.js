const express = require('express')
const app = express()
const Categories = require('../Categories/Categories')
const connection = require("../Database/database")
const subCategories = require('../Categories/subCategories/subCategories')

app.get('/', async (req, res) => {
    const categories = await Categories.findAll({
        include: [{
            model: subCategories,
            limit: 10,
        }], limit: 4, order: connection.random()
    })
    res.render('./Nav/index', { categories })
})

app.get('/profile', (req, res) => {
    res.send('profile')
})

module.exports = app