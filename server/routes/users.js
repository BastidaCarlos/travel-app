import express from "express"; 
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/User.js";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

router.put('/favorites/:itineraryId', verifyToken, async (req, res) => {
    try {
        const { itineraryId } = req.params;
        const { id } = req.user;

        const favoriteItinerary = await User.findOne({
            _id: id,
            favorites: itineraryId 
        })

        if (favoriteItinerary) {
           await User.updateOne(
                {_id: id },
                { $pull: { favorites: itineraryId }}
           ) 

           return res.status(200).json({ isFavorite: false, message: 'Deleted from favorites'})
        } else {
            await User.updateOne(
                { _id: id },
                { $addToSet: { favorites: itineraryId }}
            )

            return res.status(200).json({ isFavorite: true, message: 'Added to favorites'})
        }


    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error'})
    }
})

router.get('/favorites', verifyToken, async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id)
            .populate('favorites');

        if (!user) {
           return res.status(404).json({ message: 'User not found'})
        }

        res.status(200).json(user.favorites)
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error'})
    }
})

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password -email -googleId');

        if (!user) {
           return res.status(404).json({ message: 'User not found'}); 
        }

        const itineraries = await Itinerary.find({ createdBy: userId })

        return res.status(200).json({
            user,
            itineraries
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error'} )
    }
})

export default router;