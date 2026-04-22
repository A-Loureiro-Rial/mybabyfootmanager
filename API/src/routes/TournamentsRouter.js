const path = require("path");
const express = require("express");

const authMiddleware = require('../middlewares/authMiddleware');
const TournamentsController = require("../controllers/TournamentsController");
const router = express.Router();

// @route {GET}     /tournament/list
// @param
// @response        array of tournaments
router.get("/list", TournamentsController.getTournaments);

// @route {GET}     /tournament/
// @param           id
// @response        tournament
router.get("/:id", TournamentsController.findTournament);

// @route {POST}    /tournament/create      REQUIRES AUTH
// @bodyparams      name: string(64), description: string(255)
// @response        tournament
router.post("/create", authMiddleware, TournamentsController.createTournament);

// @route {PUT}     /tournament/update      REQUIRES AUTH
// @bodyparams      id: unsigned int, name: string(64), description: string(255)
// @response        tournament
router.put("/update", authMiddleware, TournamentsController.updateTournament);

// @route {DELETE}     /tournament/delete   REQUIRES AUTH
// @bodyparams         id: unsigned int
// @response
router.delete("/delete", authMiddleware, TournamentsController.deleteTournament)

module.exports = router;