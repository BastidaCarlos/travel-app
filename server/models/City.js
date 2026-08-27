import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'The name is required'],
            trim: true
        },
        country: {
            type: String,
            required: [true, 'The country is required'],
            trim: true
        },
        image: {
            type: String,
            required: [true, 'The URL to the image is required']
        },
        continent: {
            type: String,
            required: [true, 'The continent is required'],
            enum: ['America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Antarctica'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const City = mongoose.model("City", citySchema);

export default City;