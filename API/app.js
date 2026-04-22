// loads env variables
require('dotenv').config({ path: '../.env' });

// allows easier parsing for cookie responses
const cookieParser = require("cookie-parser");

// generates a connection to the database using sequelize
const { connectDB } = require("./config/db");
connectDB();

const express = require("express");
const path = require("path");
// module for cors error management
const cors = require("cors");
// parse the body of requests
const bodyParser = require("body-parser");
const app = express();
// create the foreign keys for the database
const { associations } = require("./src/associations");
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// loads the authMiddleware in case you want to use it for a full router
// const authMiddleware = require("./src/middlewares/authMiddleware");

const TeamsRouter = require("./src/routes/TeamsRouter");
app.use("/team", TeamsRouter);

const UsersRouter = require("./src/routes/UsersRouter");
app.use("/user", UsersRouter);

const TournamentsRouter = require("./src/routes/TournamentsRouter");
app.use("/tournament", TournamentsRouter);

const MatchesRouter = require("./src/routes/MatchesRouter");
app.use("/match", MatchesRouter);

associations();

app.listen(process.env.PORT, () => {
  console.log(`Server Started at http://localhost:${process.env.PORT}`)
})