import express from "express";
import Itinerary from "../models/Itinerary.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/authorize.js";

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

router.put("/:itineraryId", verifyToken, async (req, res) => {
    try {
        const { itineraryId } = req.params;
        const itinerary = await Itinerary.findById(itineraryId)
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found"})
        }
        const isOwner = itinerary.createdBy?.toString() === req.user.id
        const isAdminUser = req.user.role === 'admin'

        if (!isOwner && !isAdminUser) {
            return res.status(403).json({ message: 'Not authorized to modify this itinerary' })
        }

        const { createdBy, ...safeUpdateData } = req.body

        const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryId, safeUpdateData, { returnDocument: 'after' })
        res.json(updatedItinerary)

    } catch (error) {
        res.status(400).json({ message: 'Error to update the Itinerary', error: error.message})
    }
})

router.delete("/:itineraryId", verifyToken, async (req, res) => {
    try {
        const { itineraryId } = req.params;
        const itinerary = await Itinerary.findById(itineraryId)
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found"})
        }

        const isOwner = itinerary.createdBy?.toString() === req.user.id;
        const isAdminUser = req.user.role === 'admin'
        if (!isOwner && !isAdminUser) {
            return res.status(403).json({ message: 'Not authorized to modify this itinerary' })
        }

        await Itinerary.findByIdAndDelete(itineraryId); 
        return res.status(200).json({ message: 'Itinerary deleted' })
    } catch (error) {
        res.status(400).json({ message: 'Error to delete the Itinerary', error})
    }
})

export default router;