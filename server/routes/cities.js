import express from "express";
import City from "../models/City.js";
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
        res.status(500).json({ message: 'Error to get cities', error})
    }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const newCity = new City(req.body);
        const savedCity = await newCity.save();

        res.json(savedCity);
    } catch (error) {
        res.status(400).json({ message: 'Error to save the city', error})
    }
});

export default router;