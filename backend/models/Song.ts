import * as mongoose from "mongoose";
import * as mongooseUniqueValidator from "mongoose-unique-validator";

import { ObjectId } from "bson";
import { Schema } from "mongoose";

const lyricsSchema = new Schema({
	category: { type: String, required: true },
	content: { type: String, required: true }
});

const songSchema = new Schema({
	id: ObjectId,
	title: { type: String, required: true },
	theme: { type: String },
	lyrics: [lyricsSchema],
	songUrl: {type: String},
	createdBy: { type: String, required: true },
	createdAt: { type: Number, required: true },
	updatedBy: { type: String },
	updatedAt: { type: Number }
});

songSchema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });

export const songModel = mongoose.model("Song", songSchema);