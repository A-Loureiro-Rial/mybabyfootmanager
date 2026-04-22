const path = require("path");
const express = require("express");

const authMiddleware = require('../middlewares/authMiddleware');
const TeamsController = require("../controllers/TeamsController");
const router = express.Router();

// @route {GET}         /team/list
// @param
// @response            array of teams
router.get("/list", TeamsController.getTeams);

// @route {GET}         /team/
// @param               id
// @response            team
router.get("/:id", TeamsController.findTeam);

// @route {POST}        /team/create        REQUIRES AUTH
// @bodyparams          name: string(64), description: string(255)
// @response            team
router.post("/create", authMiddleware, TeamsController.createTeam);

// @route {PUT}         /team/update        REQUIRES AUTH
// @bodyparams          id: unsigned int, name: string(64), description: string(255)
// @response            team
router.put("/update", authMiddleware, TeamsController.updateTeam);

// @route {DELETE}      /team/delete     REQUIRES AUTH
// @bodyparams          id: unsigned int
// @response
router.delete("/delete", authMiddleware, TeamsController.deleteTeam);

// @route {POST}        /team/register  REQUIRES AUTH
// @bodyparams          team: unsigned int, tournament: unsigned int
// @response
router.post("/register", authMiddleware, TeamsController.register);

module.exports = router;