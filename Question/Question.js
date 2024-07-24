const Sequelize = require('sequelize')
const connection = require("../Database/database")
const Categories = require('../Categories/Categories')
const User = require('../User/User')

const Question = connection.define('Question', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sub: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idcat: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    conclusion: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})


User.hasMany(Question, {foreignKey: 'idUser'})
Question.belongsTo(User, {foreignKey: 'idUser'})

/* 
Question.sync({force: true}).then(console.log("Tabela Criada com sucesso!")) */

module.exports = Question;