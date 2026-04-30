require('dotenv').config();
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const jose = require('jose');
const bcrypt = require('bcrypt');
const saltRound = 10;
const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);


// creates a new user given a username and a password
exports.register = async (request, response) => {
    try {
        const { username, password } = request.body;
        if (username.length > 64 || username.length == 0 || password.length > 72 || password.length == 0 )
        {
            response.status(400).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        // checks if username is taken (it's supposed to be unique)
        const search = await Users.findOne({ where: { username: username } });
        // if it doesn't exist
        if (search === null) {
            // hash the password and season it
            const salt = await bcrypt.genSalt(saltRound);
            const hashedpassword = await bcrypt.hash(password, salt);
            // then create the user
            const user = await Users.create({
                username: username,
                password_hash: hashedpassword,
            });
            // then generates an access token and a refresh token: by default a new account is a user account
            const accessToken = await new jose.SignJWT({ sub: user.id, role: 'user' })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('15min')
                .sign(accessSecret);
            const refreshToken = await new jose.SignJWT({ sub: user.id, role: 'user' })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('7d')
                .sign(refreshSecret);
            const isNotLocal = process.env.ENV_LOCAL === "true" ? false : true;
            response.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: isNotLocal,          // false in local dev
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
            response.status(201).json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: "user"
                },
                accessToken: accessToken
            });
        }
        else {
            response.status(401).json({
                success: false,
                error: "Invalid credentials"
            });
        }

    } catch (error) {

        response.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// authenticate a user and generates a JWT token for them
exports.auth = async (request, response) => {
    try {
        const { username, password } = request.body;
        // checks if the username finds anyone
        const user = await Users.findOne({ where: { username: username } });
        if (user === null) {
            response.status(401).json({
                success: false,
                error: "Invalid Credentials"
            });
        }
        else {
            // checks if the given password matches the hashed one from the user
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                const role = user.account_type == 1 ? 'admin' : 'user';
                // updates the last_connexion info in the db for security
                await user.update({
                    last_connexion: new Date().toISOString().replace("T", " ").replace("Z", "")
                });
            // then generates an access token and a refresh token
                const accessToken = await new jose.SignJWT({ sub: user.id, role: role })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('15min')
                    .sign(accessSecret);
                const refreshToken = await new jose.SignJWT({ sub: user.id, role: role })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('7d')
                    .sign(refreshSecret);
                const isNotLocal = process.env.ENV_LOCAL === "true" ? false : true;
                response.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: isNotLocal,          // false in local dev
                    sameSite: "Strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 
                });
                response.status(200).json({
                    success: true,
                    accessToken: accessToken,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: role
                    }
                });
            }
            else {
                response.status(401).json({
                    success: false,
                    error: "invalid_credentials"
                });
            }
        }
    } catch (error) {
        response.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// updates a user given its password and new credentials
exports.updateUser = async (request, response) => {
    try {
        const { old_password, new_username, new_password } = request.body;
        if (new_password.length == 0 || new_password.length > 72 || new_username.length == 0 || new_username.length > 64)
        {
            response.status(400).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        // search for the user id with infos from the JWT token
        const user = await Users.findByPk(request.user.sub);
        if (user === null) {
            response.status(401).json({
                success: false,
                error: "invalid_credentials"
            });
        }
        else {
            const check = await Users.findOne({ where: { username: new_username }});
            if (check !== null && check.id != request.user.sub)
            {
                response.status(400).json({
                    success: false,
                    error: 'Invalid username'
                });
            }
            // then compares the old password with the hashed one from the user, for security reasons
            const match = await bcrypt.compare(old_password, user.password_hash);
            if (match) {
                // then hash and season the new password
                const salt = await bcrypt.genSalt(saltRound);
                const hashedpassword = new_password ? await bcrypt.hash(new_password, salt) : user.password_hash;
                // and updates the user with the new credentials
                await user.update({
                    username: new_username || user.username,
                    password_hash: hashedpassword || user.password_hash,
                });
                response.status(200).json({
                    success: true,
                    user: {
                        id: user.id,
                        username: new_username,
                        role: user.role
                    }
                });
            }
            else {
                response.status(401).json({
                    success: false,
                    error: "invalid_credentials"
                });
            }
        }
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.refresh = async (request, response) => {
    try {
        // then generates an access token and a refresh token
        const accessToken = await new jose.SignJWT({ sub: request.user.sub, role: request.user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('15min')
            .sign(accessSecret);
        const refreshToken = await new jose.SignJWT({ sub: request.user.sub , role: request.user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(refreshSecret);
        const isNotLocal = process.env.ENV_LOCAL === "true" ? false : true;
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isNotLocal,          // false in local dev
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        response.status(200).json({
            success: true,
            accessToken: accessToken
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.logout = async (request, response) => {
    try {
        const isNotLocal = process.env.ENV_LOCAL === "true" ? false : true;
        response.clearCookie("refreshToken",{
            httpOnly: true,
            secure: isNotLocal,
            sameSite: 'strict'
        });
        response.status(204).json({
            sucess: true
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }

};

exports.me = async (request, response) => {
    try{
    const user = await Users.findByPk(request.user.sub);
    if (user === null) {
        response.status(401).json({
            success: false,
            error: "failed to find user"
        });
    }
    const role = user.account_type == 1 ? 'admin' : 'user';

    response.status(200).json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            role: role
        }
    });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
};