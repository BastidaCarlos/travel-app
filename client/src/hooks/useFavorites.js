import { useState } from "react";
import { useAuth } from "./useAuth.js";
import { toggleFavorites } from "../services/userService.js";

export const useFavorites = () => {
    const { user, updateUser } = useAuth();
    const [ localError, setLocalError ] = useState('');

    const isFavorite = (itineraryId) => {
        if (!user) return false;
        return user?.favorites?.some(fav => fav.toString() === itineraryId.toString())
    }

    const toggleFavorite = async (itineraryId) => {
        if (!user) {
           setLocalError('Please log in to add this to your favorites') 
           return;
        }

        try {
            setLocalError('');
            const toggle = await toggleFavorites(itineraryId);
            const { isFavorite: isNowFavorite } = toggle;

            let updateFavorites;

            if (isNowFavorite === false) {
               updateFavorites = user.favorites.filter(
                    favId => favId.toString() !== itineraryId.toString()
               ); 
            } else {
                updateFavorites = [...user.favorites, itineraryId]
            }

            updateUser({
                ...user,
                favorites: updateFavorites
            })
        } catch (error) {
            setLocalError(error.message || 'Failed to update favorites. Please try again')
        }
    }

    return {
        isFavorite,
        toggleFavorite,
        localError 
    }
}
