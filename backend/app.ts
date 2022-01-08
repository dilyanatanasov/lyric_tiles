import express = require("express");

const app = express();
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
const cors = require("cors")

dotenv.config({path: __dirname + '/environment.env'});

const HttpError = require("./models/http-error");
import {userRouter} from "./routes/user-routes";
import {songRouter} from "./routes/song-routes";

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, HEAD, OPTIONS");
    next();
});

app.use("/api/user/", userRouter);
app.use("/api/song/", songRouter);

app.use((req, res, next) => {
    throw new HttpError("Could not find route", 404);
});

// Special Error-Handling middleware that Express recognizes
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res
        .status(error.code || 500)
        .json({message: error.message || "An unknown error occurred."});
});

mongoose
    .connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true})
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(8000);
    })
    .catch((err) => {
        throw new Error(new HttpError("Could not load application."))
    });
