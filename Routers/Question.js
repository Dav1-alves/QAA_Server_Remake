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
    Question.findAll({
        order: [['ID', 'DESC']],
        include: [
            { model: Categories },
            { model: subCategories }
        ]
    }).then(questions => {
        console.log(JSON.stringify(questions, null, 2));
        res.send(questions); 
    }).catch(error => {
        console.error('Error fetching questions:', error);
        res.status(500).send(error);
    });
});

app.post('/Save', (req, res) => {
    if (req.session.user) {
        const form = req.body

        Question.create({
            name: form.name,
            sub: form.subCategoriesCheck ? 1 : 0,
            primaryCategoryId: form.subCategoriesCheck != undefined ? null : form.categories,
            secondaryCategoryId: form.subCategoriesCheck != undefined ? form.categories : null,
            desc: form.desc,
            conclusion: 0,
            idUser: req.session.user.id
        })

        console.log(form)
        console.log(form.subCategoriesCheck != undefined ? form.categories : form.categories, form.subCategoriesCheck != undefined ? 1 : 0)

        return res.redirect('/Browser')
    }
    return res.redirect('/User/Login')
})

module.exports = app