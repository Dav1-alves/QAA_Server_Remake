const express = require('express')
const app = express()
var http = require('http');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src')))

app.get('/', (req, res) => {
    res.render('index')
})

http.createServer(app).listen(5173);