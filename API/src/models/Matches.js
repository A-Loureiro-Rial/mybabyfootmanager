const { DataTypes } = require('sequelize');
const { sequelize, syncDB } = require('../../config/db');

const Matches = sequelize.define("matches", {
    id:
    {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    score:
    {
        type: DataTypes.STRING(20),
        validate: {
            // checks if score is two numbers separated by a "/"
            is: [/^-?\d+\/-?\d+$/],
        }

    }
}, {
    tableName: 'matches',
    timestamps: true,
});

syncDB();
module.exports = Matches;