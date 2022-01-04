import express = require("express");
export const router = express.Router();
import * as songController  from "../contollers/song-controller";
router.get("/", songController.getAllSongs);
router.get("/song/:id", songController.getSong);
router.post("/song", songController.createNewSong);
router.put("/song/:id", songController.updateSong);
router.delete("/song/:id", songController.deleteSong);
