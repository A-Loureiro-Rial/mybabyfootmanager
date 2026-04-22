const Matches = require('../models/Matches');
const Registrations = require('../models/Registrations');

// list all matches given a tournament id
exports.getMatches = async (request, response) => {
    try {
        const list = await Matches.findAll({
            where: {
                tournament_id: request.params.id
            }
        });

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

// search for a specific match given its id
exports.findMatch = async (request, response) => {
    try {
        const match = await Matches.findByPk(request.params.id);

        if (!match) {
            return response.status(404).json({
                success: false,
                error: 'Match not found'
            });
        }

        response.status(200).json({
            success: true,
            data: match
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// creates matches of a tournament given its id
exports.createMatches = async (request, response) => {
    try {
        const { id } = request.body;
        // get all registrations for given tournament
        let RegistrationsList = await Registrations.findAll({
            where: {
                tournament_id: id
            }
        });

        // shuffle them
        let currentIndex = RegistrationsList.length;
        while (currentIndex != 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [RegistrationsList[currentIndex], RegistrationsList[randomIndex]] = [
                RegistrationsList[randomIndex], RegistrationsList[currentIndex]];
        }

        // and for each combination possible, create a match
        for (let i = 0; i <= RegistrationsList.length - 2; i++) {
            for (let j = i + 1; j <= RegistrationsList.length - 1; j++) {
                await Matches.create({
                    "team_a": RegistrationsList[i].dataValues["team_id"],
                    "team_b": RegistrationsList[j].dataValues["team_id"],
                    "tournament_id": id
                });
            }
        }
        response.status(201).json({
            success: true,
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            error: error.message
        });
    }

};

// set the score of a match given its id and its score, automatically set the winner depending of the score
exports.scoreMatch = async (request, response) => {
    try {
        const { id, score } = request.body;
        // search for the match with its id
        const match = await Matches.findByPk(id);
        if (!match) {
            return response.status(404).json({
                success: false,
                error: 'Match not found'
            });
        }
        // check if the score is two numbers separated by a "/"
        const regex = /^-?\d+\/-?\d+$/;
        if (!regex.test(score)) {
            return response.status(404).json({
                success: false,
                error: 'Invalid Score'
            });
        }
        // parse the score into two integers
        const scores = score.split("/");
        scores[0] = parseInt(scores[0]);
        scores[1] = parseInt(scores[1]);
        // check for whose score is higher and determine whether it's a win for a, a win for b, or a draw (in which case there's no winner)
        const winner = scores[0] > scores[1] ? match.team_a : scores[1] > scores[0] ? match.team_b : null;
        console.log("WINNER ID = " + winner);
        await match.update({
            score: score,
            winner: winner
        });
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

// deletes a match given its id
exports.deleteMatch = async (request, response) => {
    try {
        const { id } = request.body;

        // checks if match exists
        const match = await Matches.findByPk(id);
        if (!match) {
            return response.status(404).json({
                success: false,
                error: 'Match not found'
            });
        }
        // then deletes it
        await team.destroy();
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
