const express = require('express')
const app = express()
const Categories = require('../Categories/Categories')
const connection = require("../Database/database")
const subCategories = require('../Categories/subCategories/subCategories')
const Question = require('../Question/Question')

app.get('/', async (req, res) => {
    const categories = await Categories.findAll({
        include: [{
            model: subCategories,
            limit: 10,
        }], limit: 4, order: connection.random()
    })

    Question.findAll({
        order: [['ID', 'DESC']],
        include: [
            { model: Categories },
            { model: subCategories }
        ]
    }).then(questions => {
        res.render('./Nav/index', { categories, questions })
    }).catch(error => {
        console.error('Error fetching questions:', error);
        res.status(500).send(error);
    });

})

app.get('/profile', (req, res) => {
    res.send('profile')
})

module.exports = app