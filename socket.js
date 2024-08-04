// socket.js
const CategoriesDB = require('./Categories/Categories')
const subCategoriesDB = require('./Categories/subCategories/subCategories')
const User = require('./User/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const express = require('express')
const SocketApp = express();
require('dotenv').config()
var reload = () => { };

var setupSocket = (io) => {
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

        socket.on('magicLogin', async (data) => {
            reload = () => {
                try {
                    socket.emit(`magicLogin${data}`)
                } catch (err) {
                    res.send('Link inválido ou expirado.')
                }
            }
        })
    });
}

SocketApp.get('/Authenticate', async (req, res) => {
    var code = req.query.code;

    jwt.verify(code, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido ou expirado', err);
        }

        // Autenticar o usuário
        User.findOne({ where: { user: decoded.username } }).then(user => {
            req.session.user = {
                id: user.id,
                username: user.user,
                email: user.email,
                status: user.status
            };



            res.status(200).send(`<script>window. close()</script>`)

            reload();
        });


    });

})

module.exports = { setupSocket, SocketApp }