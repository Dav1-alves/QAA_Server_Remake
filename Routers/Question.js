const express = require('express')
const app = express()
const Categories = require('../Categories/Categories')
const connection = require("../Database/database")
const subCategories = require('../Categories/subCategories/subCategories')
require('dotenv').config()

app.get('/New', async (req, res) => {
    const TINY_KEY = process.env.TINY_KEY
    const categories = await Categories.findAll({
        include: [{
            model: subCategories,
            limit: 10,
        }], limit: 4, order: connection.random()
    })
    
    res.render('./Question/new', { categories, TINY_KEY: TINY_KEY })
})

app.post('/Save', (req, res) => {
    console.log(req.body.mytextarea)
})

module.exports = app