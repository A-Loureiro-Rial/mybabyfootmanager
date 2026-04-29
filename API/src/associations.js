const Matches = require("./models/Matches");
const Teams = require("./models/Teams");
const Tournaments = require("./models/Tournaments");
const Registrations = require("./models/Registrations");

const associations = async () => {
    // foreign keys for the match table (team_a, team_b and winner are ids from the teams table and tournament_id is from tournaments)
    Matches.belongsTo(Teams, {
        foreignKey: "team_a",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Matches.belongsTo(Teams, {
        foreignKey: "team_b",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Matches.belongsTo(Teams, {
        foreignKey: "winner",
        allowNull: true,
        // if the winner team no longer exists, set the winner to null
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    });
    Matches.belongsTo(Tournaments, {
        foreignKey: "tournament_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    // foreign keys for the joint table registrations
    Tournaments.belongsToMany(Teams, {
        through: Registrations,
        foreignKey: "tournament_id",
        otherKey: "team_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Teams.belongsToMany(Tournaments, {
        through: Registrations,
        foreignKey: "team_id",
        otherKey: "tournament_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
};

module.exports = { associations };