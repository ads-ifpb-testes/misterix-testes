import { Schema } from "mongoose";
import mongoose from "../data/mongoose.js";

const legendSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    location: {
        type: {type: String, required: true, enum: ['Point']},
        coordinates: {type: [Number], required: true}
    },
    postedBy: {type: String, ref: 'User', required: true}
});

const fields = {title: 'text', type: 'text', description: 'text'};
const options = {default_language: 'pt', weights: {title: 2, type: 1, description: 1}};
legendSchema.index(fields, options);

const Legend = mongoose.model('Legend', legendSchema);

export default Legend;