import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

router.get("/:cityId", async (req, res) => {
    try {
        const { cityId } = req.params;
        const itineraries = await Itinerary.find({ city: cityId })
        res.json(itineraries)
    } catch (error) {
        res.status(500).json({ message: 'Error to get the itineraries', error})
    }
});

router.post("/", async (req, res) => {
    try { 
        const newItinerary = new Itinerary(req.body);

        const savedItinerary = await newItinerary.save();
        res.json(savedItinerary);
    } catch (error) {
        res.status(400).json({ message: 'Error to save the Itinerary', error})
    }
});

export default router;