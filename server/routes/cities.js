import express from "express";
import City from "../models/City.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cities = await City.find()
        res.json(cities)
    } catch (error) {  
        res.status(500).json({ message: 'Error to get cities', error})
    }
});

router.post("/", async (req, res) => {
    try {
        const newCity = new City(req.body);

        const savedCity = await newCity.save();

        res.json(savedCity);
    } catch (error) {
        res.status(400).json({ message: 'Error to save the city', error})
    }
});

export default router;