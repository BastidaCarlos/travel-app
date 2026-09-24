import api from "./api.js";

export const login = async (credentials) => {
    try {
        const response = await api.post(
            '/auth/login',
            credentials
        );
        return response.data;
    } catch (error) {
        throw error;
    } 
}

export const register = async (userData) => {
    try {
        const response = await api.post(
            '/auth/register',
            userData
        );

        return response.data;

    } catch (error) {
        throw error;
    }
}

export const googleLogin = async (credentials) => {
   try {
    const response = await api.post(
        '/auth/google',
        credentials
    );

    return response.data;

   } catch (error) {
        throw error;
   } 
}

export const getMe = async () => {
    try {
        const response = await api.get('/auth/me');

        return response.data;

    } catch (error) {
        throw error;
    }
}

export const updateProfile = async (userData) => {
    try {
       const response = await api.put(
            '/auth/profile',
            userData
       ); 

       return response.data;

    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (credentials) => {
    try {
        const response = await api.post(
            '/auth/forgot-password',
            credentials
        );

        return response.data
        
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (credentials) => {
    try {
        const response = await api.post(
            '/auth/reset-password',
            credentials
        );

        return response.data;
        
    } catch (error) {
        throw error;
    }
}