import api from "./api";

export const getItinerariesByCity = async (cityId) => {
    try {
        const response = await api.get(`/itineraries/${cityId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getItineraryDetails = async (itineraryId) => {
    try {
        const response = await api.get(`/itineraries/details/${itineraryId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createItinerary = async (itineraryData) => {
    try {
        const response = await api.post('/itineraries', itineraryData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createCuratedItinerary = async (itineraryData) => {
    try {
        const response = await api.post('/itineraries/curated', itineraryData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateItinerary = async (itineraryId ,itineraryData) => {
    try {
        const response = await api.put(`/itineraries/${itineraryId}`, itineraryData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteItinerary = async (itineraryId) => {
    try {
        const response = await api.delete(`/itineraries/${itineraryId}`);
        return response.data
    } catch (error) {
        throw error
    }
}