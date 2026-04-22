const { DataTypes } = require('sequelize');
const { sequelize, syncDB } = require('../../config/db');

const Users = sequelize.define('users', {
    id:
    {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    username:
    {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            len: [5, 64],
            isAlphanumeric: true,
        }
    },
    password_hash:
    {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [8, 255],
        },
    },
    last_connexion:
    {
        type: DataTypes.DATE(6),
        defaultValue: new Date().toISOString().replace("T", " ").replace("Z", "")
    },
    account_type:
    {
        type: DataTypes.BOOLEAN,
        // 0 for regular users, 1 for admins
        defaultValue: 0
    },
    active_account:
    {
        // 1 for active account, 0 for disabled
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    }
}, {
    tableName: 'users',
    timestamps: true,
});

syncDB();

module.exports = Users;