const express = require('express')
const app = express()
const Categories = require('../Categories/Categories')
const connection = require("../Database/database")
const Question = require('../Question/Question')
const subCategories = require('../Categories/subCategories/subCategories')
const { parse } = require('dotenv')
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

app.get('/Verify', (req, res) => {
    Question.findAll().then(Question => {
        res.send(`${Question[3].desc}`)
    })
})

app.post('/Save', (req, res) => {
    if (req.session.user) {
        var check = req.body.subCategoriesCheck == "on"
        var categoria;
        var subcategories;
        var name = req.body.name;

        if (check) {
            categoria = parseInt(req.body.subcategories)
            subcategories = 1;
        }

        if (!check) {
            categoria = parseInt(req.body.categories)
            subcategories = 0;
        }

        console.log({ check, categoria, subcategories, name })


        Question.create({
            name: name,
            sub: subcategories,
            idcat: categoria,
            desc: req.body.desc,
            conclusion: 0,
            idUser: req.session.user.id
        })

        return res.redirect('/Browser')
    }
    return res.redirect('/User/Login')
})

module.exports = app