const Sequelize = require('sequelize')
const connection = require("../Database/database")

const User = connection.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    useradm: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

/* User.sync({force: false}).then(console.log("Tabela Criada com sucesso!")) */

module.exports = User;