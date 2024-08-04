const express = require('express')
var http = require('http');
const path = require('path');
const connection = require("./Database/database")
const CategoriesDB = require('./Categories/Categories')
const subCategoriesDB = require('./Categories/subCategories/subCategories')
const session = require('express-session')
const { Op } = require('sequelize');
const socketIo = require('socket.io');
const {setupSocket} = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar o socket
setupSocket(io);

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'segurança :)',
  resave: false,
  saveUninitialized: true
}))

connection.authenticate()


app.use(express.static(path.join(__dirname, "src")));
app.set('view engine', 'ejs');
app.use(express.json({limit: '10000mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.get('/', async (req, res) => {
    const categories = await CategoriesDB.findAll({
        include: [{
            model: subCategoriesDB,
            limit: 10,
        }], limit: 4, order: connection.random()
    })
    res.render('./index', { categories, user: req.session.user })
})

const Nav = require('./Routers/Nav')
app.use('/Browser', Nav)

const Categories = require('./Routers/Categories')
app.use('/Categories', Categories)

const Question = require('./Routers/Question')
app.use('/Question', Question)

const User = require('./Routers/User')
app.use('/User', User)

const {SocketApp} = require('./socket')
app.use('/Socket', SocketApp)

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { server, io }