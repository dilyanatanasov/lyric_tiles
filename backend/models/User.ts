import * as mongoose from "mongoose";
import * as mongooseUniqueValidator from "mongoose-unique-validator";

import { ObjectId } from "bson";
import { Schema } from "mongoose";

const userSchema = new Schema({
    id: ObjectId,
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: {type: String},
    lastName: {type: String},
    authData: {type: String},
    createdBy: { type: String, required: true },
    createdAt: { type: Number, required: true },
    updatedBy: { type: String },
    updatedAt: { type: Number }
});

userSchema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });

export const userModel = mongoose.model("User", userSchema);