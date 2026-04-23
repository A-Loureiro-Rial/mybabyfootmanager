const path = require("path");
const express = require("express");

const authMiddleware = require('../middlewares/authMiddleware');
const MatchesController = require("../controllers/MatchesController");
const authorizeRoles = require("../middlewares/authorizeRoles");

const router = express.Router();

// @route {GET}         /match/list/
// @param               id(tournament)
// @response            array of matches
router.get("/list/:id", MatchesController.getMatches);

// @route {GET}         /match/
// @param               id(match)
// @response            match
router.get("/:id", MatchesController.findMatch);

// @route {POST}        /match/create
// @bodyparams          id(tournament)
// @response            
router.post("/create", authMiddleware, authorizeRoles("admin"), MatchesController.createMatches);

// @route {PUT}         /match/score
// @bodyparams          id(match), score: string(20) matching regex /^-?\d+\/-?\d+$/ (two ints separated by a /)
// @response 
router.put("/score", authMiddleware, authorizeRoles("admin"), MatchesController.scoreMatch);

// @route {DELETE}      /match/delete
// @bodyparams          id(match)
// @response 
router.delete("/delete", authMiddleware, authorizeRoles("admin"), MatchesController.deleteMatch);

module.exports = router;