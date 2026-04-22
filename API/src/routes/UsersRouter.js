const path = require('path');
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const UsersController = require('../controllers/UsersController');
const router = express.Router();

// @route {POST}    /user/register
// @bodyparams      username: string(64), password: string(72)
// @response        jwt token
router.post("/register", UsersController.register);

// @route {POST}    /user/auth
// @bodyparams      username: string(64), password: string(72)
// @response        jwt token
router.post("/auth", UsersController.auth);

// @route {POST}    /user/update    REQUIRES AUTH
// @bodyparams      old_password: string(72), new_username: string(64), new_password: string(72)
// @response        jwt token
router.put("/update", authMiddleware, UsersController.updateUser);

module.exports = router;