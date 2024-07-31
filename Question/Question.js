const Sequelize = require('sequelize')
const connection = require("../Database/database")
const Categories = require('../Categories/Categories')
const subCategories = require('../Categories/subCategories/subCategories')
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
    primaryCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Categories,
            key: 'id'
        }
    },
    secondaryCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: subCategories,
            key: 'id'
        }
    },
    desc: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    conclusion: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
})


User.hasMany(Question, { foreignKey: 'idUser' })
Question.belongsTo(User, { foreignKey: 'idUser' })

Categories.hasMany(Question, { foreignKey: 'primaryCategoryId'});
Question.belongsTo(Categories, { foreignKey: 'primaryCategoryId' })
subCategories.hasMany(Question, { foreignKey: 'secondaryCategoryId'});
Question.belongsTo(subCategories, { foreignKey: 'secondaryCategoryId' })

/* 
Question.sync({force: true}).then(console.log("Tabela Criada com sucesso!")) */

module.exports = Question;