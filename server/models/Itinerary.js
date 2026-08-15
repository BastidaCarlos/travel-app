import mongoose, { Schema } from "mongoose";

const itinerarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: Number,
    duration: Number,
    city: { type: Schema.Types.ObjectId, ref: 'City'}
})

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;