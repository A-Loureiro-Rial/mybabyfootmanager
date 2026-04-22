const { DataTypes } = require('sequelize');
const { sequelize, syncDB } = require('../../config/db');

// there's just an id because it's a joint table for Teams and Tournament, check associations.js for more
const Registrations = sequelize.define("registrations", {
    id:
    {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    }
}, {
    tableName: 'registrations',
    timestamps: false,
});

syncDB();
module.exports = Registrations;








