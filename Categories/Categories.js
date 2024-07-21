const Sequelize = require('sequelize')
const connection = require("../Database/database")

const Categories = connection.define('Categories', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sub: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})
/* 
Categories.sync({force: true}).then(console.log("Tabela Criada com sucesso!")) */

module.exports = Categories;