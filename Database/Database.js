const { Sequelize, DataTypes, Op } = require('sequelize');

const connection = new Sequelize('qaa_remake','root','1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});


module.exports = connection;
