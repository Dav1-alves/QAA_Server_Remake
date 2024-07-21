const Sequelize = require('sequelize')
const connection = require("../../Database/database")
const Categories = require('../Categories');

const subCategories = connection.define('subCategories', {
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
    idCat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Categories,
            key: 'id'
        }
    }
})

Categories.hasMany(subCategories, {foreignKey: 'idCat'})
subCategories.belongsTo(Categories, {foreignKey: 'idCat'})

/* 
subCategories.sync({force: true}).then(console.log("Tabela Criada com sucesso!")) */

module.exports = subCategories;