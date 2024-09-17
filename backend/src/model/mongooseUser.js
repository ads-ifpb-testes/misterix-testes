import { Schema } from "mongoose";
import mongoose from "../data/mongoose.js";

const userSchema = new Schema({
    login: {type: String, required: true, unique: true, index: true},
    password: {type: String, required: true},
    postedLegends: {type: [Schema.Types.ObjectId], ref: 'Legend'}
});

const User = mongoose.model('User', userSchema);

export default User;