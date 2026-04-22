const { DataTypes } = require('sequelize');
const { sequelize, syncDB } = require('../../config/db');

const Teams = sequelize.define("teams", {
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
    tableName: 'teams',
    timestamps: true,
});

syncDB();
module.exports = Teams;