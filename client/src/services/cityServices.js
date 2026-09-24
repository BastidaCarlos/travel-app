import api from "./api";

export const getAllCities = async () => {
    try {
        const response = await api.get('/cities')
        return response.data
    } catch (error) {
        throw error    
    }
}

export const getCityById = async (cityId) => {
    try {
        const response = await api.get(`/cities/${cityId}`)
        return response.data
    } catch (error) {
        throw error;    
    }
}

export const createCity = async (cityData) => {
    try {
        const response = await api.post('/cities', cityData);
        return response.data
    } catch (error) {
        throw error    
    }
}

export const updateCity = async (cityId, cityData) => {
    try {
        const response = await api.put(`/cities/${cityId}`, cityData);
        return response.data
    } catch (error) {
        throw error    
    }
}

export const deleteCity = async (cityId) => {
    try {
        const response = await api.delete(`/cities/${cityId}`);
        return response.data
    } catch (error) {
        throw error
    }
}