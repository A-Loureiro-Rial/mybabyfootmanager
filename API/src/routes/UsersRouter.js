const path = require('path');
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRefreshToken = require("../middlewares/checkRefreshToken");
const UsersController = require('../controllers/UsersController');
const router = express.Router();

// @route {POST}    /user/register
// @bodyparams      username: string(64), password: string(72)
// @response        jwt token, user infos
router.post("/register", UsersController.register);

// @route {POST}    /user/auth
// @bodyparams      username: string(64), password: string(72)
// @response        jwt token, user infos
router.post("/auth", UsersController.auth);

// @route {POST}    /user/update    REQUIRES AUTH
// @bodyparams      old_password: string(72), new_username: string(64), new_password: string(72)
// @response        user infos
router.put("/update", authMiddleware, UsersController.updateUser);

// @route {POST}     /user/refresh
// @bodyparams
// @response         jwt token
router.post("/refresh", checkRefreshToken, UsersController.refresh);

// @route {POST}    /user/logout
// @bodyparams
// @response
router.post("/logout", UsersController.logout);

// @route {GET}     /user/me
// @params
// @response        user infos
router.get("/me", authMiddleware, UsersController.me);

module.exports = router;