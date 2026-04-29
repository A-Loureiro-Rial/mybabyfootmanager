const Tournaments = require('../models/Tournaments');

// lists all tournaments
exports.getTournaments = async (request, response) => {
    try {
        const list = await Tournaments.findAll();

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
// finds a specific tournament given its id
exports.findTournament = async (request, response) => {
    try {
        // Checks if tournament exists...
        const tournament = await Tournaments.findByPk(request.params.id);

        if (!tournament) {
            return response.status(404).json({
                success: false,
                error: 'Tournament not found'
            });
        }

        response.status(200).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// creates a tournament given its name and description
exports.createTournament = async (request, response) => {
    try {
        const { name, description, date } = request.body;
        // checks if date matches a datetime regex
        const regex =/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        if (!regex.test(date))
        {
            return response.status(404).json({
                success: false,
                error: 'Invalid Date'
            });
        }

        const tournament = await Tournaments.create({
            name,
            description,
            date
        });

        response.status(201).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            error: error.message
        });
    }
};
// updates a tournament given its id and infos
exports.updateTournament = async (request, response) => {
    try {

        const { id, name, description, date } = request.body;
        // you know I always check if the row exist ;)
        const tournament = await Tournaments.findByPk(id);

        if (!tournament) {
            return response.status(404).json({
                success: false,
                error: 'Tournament not found'
            });
        }
        // checks if date matches a datetime regex
        const regex =/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        if (!regex.test(date))
        {
            return response.status(404).json({
                success: false,
                error: 'Invalid Date'
            });
        }
        
        // here's where the update happens
        await tournament.update({
            name: name || tournament.name,
            description: description || tournament.description,
            date: date || tournament.date
        });

        response.status(200).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// delete a tournament given its id
exports.deleteTournament = async (request, response) => {
    try {
        const { id } = request.body;
        // you know, I check if tournament exists just in case
        const tournament = await Tournaments.findByPk(id);
        if (!tournament) {
            return response.status(404).json({
                success: false,
                error: 'Tournament not found'
            });
        }
        // AND DESTROYS IT MOUAHAHAHAH
        await tournament.destroy();

        response.status(200).json({
            success: true,
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getRegistrations = async (request, response) => {
    try {
        // Checks if tournament exists...
        const tournament = await Tournaments.findByPk(request.params.id);

        if (!tournament) {
            return response.status(404).json({
                success: false,
                error: 'Tournament not found'
            });
        }
        const registrations = await tournament.getTeams({
            attributes: ['id', 'name', 'description'],
            joinTableAttributes: []
        });
        response.status(200).json({
            success: true,
            data: registrations
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};
