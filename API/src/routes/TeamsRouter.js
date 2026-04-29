const path = require("path");
const express = require("express");

const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require("../middlewares/authorizeRoles");
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
router.post("/create", authMiddleware, authorizeRoles("admin"), TeamsController.createTeam);

// @route {PUT}         /team/update        REQUIRES AUTH
// @bodyparams          id: unsigned int, name: string(64), description: string(255)
// @response            team
router.put("/update", authMiddleware, authorizeRoles("admin"), TeamsController.updateTeam);

// @route {DELETE}      /team/delete     REQUIRES AUTH
// @bodyparams          id: unsigned int
// @response
router.delete("/delete", authMiddleware, authorizeRoles("admin"), TeamsController.deleteTeam);

// @route {POST}        /team/register  REQUIRES AUTH
// @bodyparams          teams: array of unsigned ints, tournament: unsigned int
// @response
router.post("/register", authMiddleware, authorizeRoles("admin"), TeamsController.register);

// @route {DELETE}        /team/unregister  REQUIRES AUTH
// @bodyparams          team: unsigned int, tournament: unsigned int
// @response
router.delete("/unregister", authMiddleware, authorizeRoles("admin"), TeamsController.unregister)

module.exports = router;