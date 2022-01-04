import {songModel as Song} from "../models/Song";

export const getAllSongs = async (req, res) => {
    const {title} = req.headers;
    let songs;
    try {
        if (title) {
            songs = await Song.find()
                .where("title").regex(new RegExp(".*" + title + ".*", "i"))
        } else {
            songs = await Song.find({});
        }
    } catch (error) {
        res.status(500).json({error: "Something went wrong 1"});
    }
    res.status(200).json({songs: songs.map(u => u.toObject({getters: true}))});
};

export const getSong = async (req, res) => {
    const id = req.params.id;
    let song;
    try {
        song = await Song.findById(id);
    } catch (error) {
        res.status(500).json({error: "Something went wrong 2"});
    }

    res.status(200).json({song});
};


export const createNewSong = async (req, res) => {
    const {title, theme, lyrics, songUrl} = req.body;
    try {
        const newSong = new Song({
            title,
            theme,
            lyrics,
            songUrl,
            createdBy: Date.now(),
            createdAt: Date.now()
        });
        await newSong.save();
        res.status(200).json({message: "You added a new book "});
    } catch (error) {
        res.status(500).json({error: "Something went wrong 3"});
    }
}

export const updateSong = async (req, res) => {
    let song;
    const id = req.params.id;
    const data = req.body;
    try {
        song = await Song.findById(id);
        Object.assign(song, data);
        song.save();
        res.status(200).json({song});
    } catch (error) {
        res.status(500).json({error: "Something went wrong 3"});
    }
}

export const deleteSong = async (req, res) => {
    const id = req.params.id;
    try {
        await Song.findByIdAndDelete(id);
    } catch (error) {
        res.status(500).json({error: "Something went wrong 2"});
    }
    res.status(200).json("Deleted");
};