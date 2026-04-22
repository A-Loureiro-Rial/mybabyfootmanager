const jwt = require('jsonwebtoken');
require('dotenv').config();

// checks if the request contains a JWT in the header
const checkRefreshToken = async (request, response, next) => {
    try {
        // search for bearer token
        const token = request.cookies.refreshToken;
        if (!token) {
            return response.status(401).json({ message: 'Token missing' });
        }
        // verify if JWT token is valid
        await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                return response.status(401).json({ message: 'Invalid or expired refresh token' });
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

module.exports = checkRefreshToken;