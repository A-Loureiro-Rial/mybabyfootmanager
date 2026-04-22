const Registrations = require('../models/Registrations');
const Teams = require('../models/Teams');
const Tournaments = require('../models/Tournaments');

// list all teams
exports.getTeams = async (request, response) => {
    try {
        const list = await Teams.findAll();

        response.status(200).json({
            success: true,
            count: list.length,
            data: list
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// finds a team given its id
exports.findTeam = async (request, response) => {
    try {
        const team = await Teams.findByPk(request.params.id);

        if (!team) {
            return response.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        response.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// create a team given its name and description
exports.createTeam = async (request, response) => {
    try {
        const { name, description } = request.body;

        const team = await Teams.create({
            name,
            description
        });

        response.status(201).json({
            success: true,
            data: team
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// updates a team given its id and new infos (or old ones if you don't want to update anything)
exports.updateTeam = async (request, response) => {
    try {

        const { id, name, description } = request.body;
        // checks if team exists
        const team = await Teams.findByPk(id);

        if (!team) {
            return response.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }
        // then updates it
        await team.update({
            name: name || team.name,
            description: description || team.description
        });

        response.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// deletes a team given its id
exports.deleteTeam = async (request, response) => {
    try {
        const { id } = request.body;
        // you get it, it checks if team exists
        const team = await Teams.findByPk(id);

        if (!team) {
            return response.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        // and DESTROYYYYYS it
        await team.destroy();

        response.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// registers a team to a tournament given the team's id and the tournament's id
exports.register = async (request, response) => {
    try {
        const { team, tournament } = request.body;
        // blablabla checks if they exist
        const searchTeam = await Teams.findByPk(team);
        const searchTournament = await Tournaments.findByPk(tournament);

        if (!searchTeam || !searchTournament) {
            return response.status(404).json({
                success: false,
                error: 'Registration failed: team or tournament does not exist.'
            });
        }
        // since registrations uses a joint table, you can register a team to a tournament with this function and it will automatically insert the row.
        searchTournament.addTeams(searchTeam, { through: { selfGranted: false } });

        response.status(201).json({
            success: true,
            data: {}
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};