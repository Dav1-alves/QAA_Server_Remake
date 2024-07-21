const express = require('express')
const app = express()
const connection = require("../Database/database")
const Categories = require('../Categories/Categories')
const subCategories = require('../Categories/subCategories/subCategories')
const slug = require('slug')

app.get('/New', async (req, res) => {
    const categories = await Categories.findAll({
        include: [{
            model: subCategories,
            limit: 10,
        }], limit: 4, order: connection.random()
    })
    res.render('Categories/categories', { categories })
})

app.get('/Search', async (req, res) => {
    console.log(await Categories.findAll({ include: subCategories }))
})

app.post('/Save', async (req, res) => {
    const name = req.body.name
    const desc = req.body.desc
    const subCategoriesCheck = req.body.subCategories
    const subCategoriesList = parseInt(req.body.subCategoriesList)
    if (subCategoriesCheck == 'on') {
        subCategories.create({
            name,
            desc,
            slug: slug(name),
            idCat: subCategoriesList
        })

        return res.redirect('/')
    }

    if (subCategoriesCheck != 'on') {
        Categories.create({
            name,
            desc,
            slug: slug(name),
            sub: 0
        })

        return res.redirect('/')
    }

    console.error('Erro ao criar Categoria');
    return res.redirect('/')
})

module.exports = app