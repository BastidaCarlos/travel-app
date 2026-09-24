import api from "./api";

export const getPublicProfile = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getMyFavorites = async () => {
    try {
        const response = await api.get('/users/favorites')
        return response.data
    } catch (error) {
        throw error;
    }
}

export const toggleFavorites = async (itineraryId) => {
    try {
        const response = await api.put(`/users/favorites/${itineraryId}`)
        return response.data
    } catch (error) {
        throw error;
    }
}