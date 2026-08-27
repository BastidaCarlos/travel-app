import mongoose, { Schema } from "mongoose";

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxLength: 500
    },
    durationInMinutes: {
        type: Number,
        min: 1
    },
    cost: {
        type: Number,
        default: 0
    },
    location: String
});

const itinerarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, maxLength: 800 },
    priceTotal: Number,
    durationInDays: Number,
    city: { type: Schema.Types.ObjectId, ref: 'City' },
    activities: [activitySchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;