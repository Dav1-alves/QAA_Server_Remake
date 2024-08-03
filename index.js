const express = require('express')
var http = require('http');
const path = require('path');
const connection = require("./Database/database")
const CategoriesDB = require('./Categories/Categories')
const subCategoriesDB = require('./Categories/subCategories/subCategories')
const session = require('express-session')
const socketIo = require('socket.io');
const { Op } = require('sequelize');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'segurança :)',
  resave: false,
  saveUninitialized: true
}))

connection.authenticate().then(() => { console.log("Conexão efetuada com sucesso!") }).catch((ErrorMsg) => { console.log("Não foi possivel iniciar uma conexão ao banco de dados! Msg de erro: ".ErrorMsg) })


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

io.on('connection', (socket) => {
    socket.on('search', async (query) => {
        try {
            var items
            if (!query.checkbox) {
                items = await CategoriesDB.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${query.searchText}%`
                        }
                    },
                    limit: 10
                });
            }

            if (query.checkbox) {
                 items = await subCategoriesDB.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${query.searchText}%`
                        }
                    },
                    include: [
                        { model: CategoriesDB },
                    ],
                    limit: 10
                });
            }
            socket.emit('searchResults', items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    });
});

const User = require('./Routers/User')
app.use('/User', User)

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});