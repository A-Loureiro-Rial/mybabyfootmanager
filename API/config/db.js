require('dotenv').config;
const Sequelize = require('sequelize');
const mysql = require('mysql2');

const sequelize = new Sequelize(
    process.env.DBNAME,
    process.env.DBUSER,
    process.env.DBPASSWORD,
    {
        host: process.env.DBHOST,
        dialect: process.env.DBDIALECT,
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

const syncDB = async () => {
    await sequelize.sync({});
};


module.exports = { sequelize, connectDB, syncDB };