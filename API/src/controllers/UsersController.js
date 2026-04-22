require('dotenv').config();
const Users = require('../models/Users');
const jose = require('jose');
const bcrypt = require('bcrypt');
const saltRound = 10;
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// creates a new user given a username and a password
exports.register = async (request, response) => {
    try {
        const { username, password } = request.body;
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
            // and finally, generate a JWT token with this user's infos and returns it.
            // by default, all accounts are users because i don't need accounts that are not admins yet.
            // However if it changes, there's a parameter called account_type (Boolean) in the db: 0 for users and 1 for admins
            const token = await new jose.SignJWT({ sub: user.id, role: 'user' })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('1h')
                .sign(secret);
            const isNotLocal = process.env.ENV_LOCAL === "true" ? false : true;
            response.cookie("auth_token", token, {
                httpOnly: true,
                secure: isNotLocal,          // false in local dev
                sameSite: "Strict",
                maxAge: 60 * 60 * 1000
            });
            response.status(201).json({
                success: true,
            });
        }
        else {
            response.status(401).json({
                success: false,
                error: "user already exist"
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
                error: "invalid_credentials"
            });
        }
        else {
            // checks if the given password matches the hashed one from the user
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                // as said above, accounts types are already taken care of, they're just created as user by default
                const role = user.account_type == 1 ? 'admin' : 'user';
                // generates a JTW token
                const token = await new jose.SignJWT({ sub: user.id, role: role })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('1h')
                    .sign(secret);
                // updates the last_connexion info in the db for security
                await user.update({
                    last_connexion: new Date().toISOString().replace("T", " ").replace("Z", "")
                });
                const isNotLocal = process.env.ENV_LOCAL === "true" ? false : true;
                response.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: isNotLocal,          // false in local dev
                    sameSite: "Strict",
                    maxAge: 60 * 60 * 1000
            });
                response.status(200).json({
                    success: true,
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
        // search for the user id with infos from the JWT token
        const user = await Users.findByPk(request.user.sub);
        if (user === null) {
            response.status(401).json({
                success: false,
                error: "invalid_credentials"
            });
        }
        else {
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
                const role = user.account_type === 1 ? 'admin' : 'user';
                // and generates a new JWT just in case
                const token = await new jose.SignJWT({ sub: user.id, role: role })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('1h')
                    .sign(secret);
                const isNotLocal = process.env.ENV_LOCAL === "true" ? false : true;
                response.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: isNotLocal,          // false in local dev
                    sameSite: "Strict",
                    maxAge: 60 * 60 * 1000
                });
                response.status(200).json({
                    success: true,
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

exports.disableUser = async (request, response) => {

};
