import express from "express";
import City from "../models/City.js";
import Itinerary from "../models/Itinerary.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const {  continent } = req.query;
        const filter = continent ? { continent } : {};
        const cities = await City.find(filter)
        res.json(cities)
    } catch (error) {  
        res.status(500).json({ message: 'Error to get cities', error: error.message})
    }
});

router.get('/:cityId', async (req, res) => {
    try {
        const { cityId } = req.params;
        const city = await City.findById(cityId);

        if (!city) {
            return res.status(404).json({ message: 'City not found'})
        }

        res.json(city);        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching city details', error: error.message})
    }
})

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const newCity = new City(req.body);
        const savedCity = await newCity.save();

        res.json(savedCity);
    } catch (error) {
        res.status(400).json({ message: 'Error to save the city', error: error.message})
    }
});

router.put('/:cityId', verifyToken, isAdmin, async (req, res) => {
    try {
        const { cityId } = req.params;
        const city = await City.findById(cityId);
        if (!city) return res.status(404).json({ message: 'City not found' })
        const cityUpdate = await City.findByIdAndUpdate(cityId, req.body, { returnDocument: 'after' }) 
        return res.json(cityUpdate)
    } catch (error) {
        res.status(400).json({ message: 'Error to update the city', error: error.message})
    }
})

router.delete('/:cityId', verifyToken, isAdmin, async (req, res) => {
    try {
        const { cityId } = req.params;
        const city = await City.findById(cityId);

        if (!city) return res.status(404).json({ message: 'City not found' });

        await Itinerary.deleteMany({ city: cityId })

        await City.findByIdAndDelete(cityId);
        return res.status(200).json({ message: 'City Deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error to delete the city', error: error.message})
    }
})

export default router;