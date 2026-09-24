import { useState, useEffect, useCallback, createContext } from "react";
import { getMe, login, register, googleLogin } from "../services/authServices";

export const AuthContext = createContext(null); 
export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ token, setToken ] = useState(() => {
        return localStorage.getItem('token') || null;
    });
    const [ authLoading, setAuthLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const clearError = useCallback(() => {
        setError(null)
    }, []) 

    useEffect(() => {
        const verifySession = async () => {

            if (!token || token === null) {
               setAuthLoading(false); 
               return;
            }
            try {
                const userData = await getMe()
                setUser(userData.user)

            } catch (error) {
                setUser(null); 
                setToken(null);
                localStorage.removeItem('token');
                setError(error.response?.data?.message || 'Session expired');
            } finally {
                setAuthLoading(false);
            }
        }

        verifySession();
    }, []);

    const loginContext = useCallback(async (credentials) => {
        try {

            setError(null);

            const data = await login(credentials);
            const userToken = data.token;
            localStorage.setItem('token', userToken);
            setToken(userToken);
            setUser(data.user);

            return data;

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login error';
            setError(errorMessage);
            throw error;
        }
    }, []); 

    const registerContext = useCallback(async (userData) => {
        try {

            setError(null);

            const data = await register(userData);
            const userToken = data.token;
            localStorage.setItem('token', userToken);
            setToken(userToken);
            setUser(data.user);

            return data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Register error';
            setError(errorMessage);
            throw error;
        }
    }, []); 

    const googleLoginContext = useCallback(async (credentials) => {
        try {

            setError(null);

            const data = await googleLogin(credentials);
            const userToken = data.token;
            localStorage.setItem('token', userToken);
            setToken(userToken);
            setUser(data.user);

            return data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login error';
            setError(errorMessage);
            throw error;
        }
    }, []) 

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const updateUser = useCallback((newData) => {
        setUser(prevData => ({
            ...prevData,
            ...newData
        }))
    }, [])

    return (
        <AuthContext.Provider value={{ token, user, clearError, authLoading, error, loginContext, registerContext, googleLoginContext, logout, updateUser }}>
            { children }
        </AuthContext.Provider>
    )
}