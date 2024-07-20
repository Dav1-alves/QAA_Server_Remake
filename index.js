const express = require('express')
const app = express()
var http = require('http');
const path = require('path');
const connection = require("./Database/database")

connection.authenticate().then(() => { console.log("Conexão efetuada com sucesso!") }).catch((ErrorMsg) => { console.log("Não foi possivel iniciar uma conexão ao banco de dados! Msg de erro: ".ErrorMsg) })

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
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