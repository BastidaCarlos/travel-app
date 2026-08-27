import express from "express";
import Itinerary from "../models/Itinerary.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/authorize.js";

const router = express.Router();

router.get("/city/:cityId", async (req, res) => {
    try {
        const { cityId } = req.params;
        const itineraries = await Itinerary.find({ city: cityId })
        res.json(itineraries)
    } catch (error) {
        res.status(500).json({ message: 'Error to get the itineraries', error})
    }
});

// Getting an itinerary based on your ID 
router.get('/details/:itineraryId', async (req, res) => {
   try {
    const { itineraryId } = req.params;
    const itinerary = await Itinerary.findById(itineraryId)
        .populate("city")
        .populate("createdBy", "-password");

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found"})
        }

        res.json(itinerary);
   } catch (error) {
        res.status(500).json({ message: 'Error to get the itinerary', error})
   } 
})

// System route creation 
router.post('/curated', verifyToken, isAdmin, async (req, res) => {
    try {
        const { activities } = req.body;

        if (!activities || activities.length < 3) {
           return res.status(400).json( { message: 'An itinerary needs at least 3 activities'}) 
        }
        
        const newItinerary = new Itinerary(req.body);
        const savedItinerary = await newItinerary.save();
        res.json(savedItinerary);
    } catch (error) {
        res.status(400).json({ message: 'Error to save the itinerary', error})
    }
})

// User route creation
router.post("/", verifyToken, async (req, res) => {
    try { 
        const { activities } = req.body;

        if (!activities || activities.length < 3) {
           return res.status(400).json({ message: 'An itinerary needs at least 3 activities'}) 
        }

        const newItinerary = new Itinerary({
            ...req.body,
            createdBy: req.user.id,
        });

        const savedItinerary = await newItinerary.save();
        res.json(savedItinerary);
    } catch (error) {
        res.status(400).json({ message: 'Error to save the Itinerary', error})
    }
});

export default router;