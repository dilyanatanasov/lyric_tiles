import express = require("express");
import * as songController  from "../contollers/song-controller";

export const songRouter = express.Router();
songRouter.get("/", songController.getAllSongs);
songRouter.get("/:id", songController.getSong);
songRouter.post("/", songController.createNewSong);
songRouter.put("/:id", songController.updateSong);
songRouter.delete("/:id", songController.deleteSong);
