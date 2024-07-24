const express = require('express')
const app = express()
var http = require('http');
const path = require('path');
const connection = require("./Database/database")
const CategoriesDB = require('./Categories/Categories')
const subCategoriesDB = require('./Categories/subCategories/subCategories')
const session = require('express-session')

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'segurança :)',
  resave: false,
  saveUninitialized: true
}))

connection.authenticate().then(() => { console.log("Conexão efetuada com sucesso!") }).catch((ErrorMsg) => { console.log("Não foi possivel iniciar uma conexão ao banco de dados! Msg de erro: ".ErrorMsg) })

app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.get('/', async (req, res) => {
    const categories = await CategoriesDB.findAll({
        include: [{
            model: subCategoriesDB,
            limit: 10,
        }], limit: 4, order: connection.random()
    })
    res.render('./index', { categories })
})

const Nav = require('./Routers/Nav')
app.use('/Browser', Nav)

const Categories = require('./Routers/Categories')
app.use('/Categories', Categories)

const Question = require('./Routers/Question')
app.use('/Question', Question)

const User = require('./Routers/User')
app.use('/User', User)

http.createServer(app).listen(5173);