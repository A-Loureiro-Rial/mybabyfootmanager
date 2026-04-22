const jwt = require('jsonwebtoken');
require('dotenv').config();

// checks if the request contains a JWT in the header
const authMiddleware = async (request, response, next) => {
    try {

        // checks for bearer parameter in authorization header and get the JWT
        const authHeader = request.headers['authorization'];
        const token = authHeader.split(' ')[1];
        if (!token) {
            return response.status(401).json({ message: 'Token missing' });
        }
        // verify if JWT token is valid
        await jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return response.status(403).json({ message: 'Invalid or expired token' });
            }
            // if everything's ok, feed user's infos from the JWT to request and move on to the controller (or next middleware)
            request.user = decoded;
            next();
        });
    }
    catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = authMiddleware;