const { DataTypes } = require('sequelize');
const { sequelize, syncDB } = require('../../config/db');

const Tournaments = sequelize.define("tournaments", {
    id:
    {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name:
    {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    description:
    {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    tableName: 'tournaments',
    timestamps: true,
});

syncDB();
module.exports = Tournaments;