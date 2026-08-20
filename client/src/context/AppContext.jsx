import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
    // Variables for Cities
    const [cities, setCities] = useState([]);
    const [citiesIsLoading, setCitiesIsLoading] = useState(true);
    const [citiesError, setCitiesError] = useState(null);
    // Variables for itineraries
    const [itineraries, setItineraries] = useState([]);
    const [itinerariesIsLoading, setItinerariesIsLoading] = useState(true);
    const [itinerariesError, setItinerariesError] = useState(null);

    // Fetch for cities
    const fetchCities = async () => {
        try {

            setCitiesIsLoading(true);
            setCitiesError(null);

            const responseCities = await fetch('http://localhost:5000/api/cities');
            
            if (!responseCities.ok) {
               const errorData = await responseCities.json(); 
               throw new Error(errorData.message || "Error with request");
            }

            const citiesList = await responseCities.json()

            setCities(citiesList);

        } catch (error) {
            setCitiesError(error.message);
        } finally {
            setCitiesIsLoading(false);
        }
    }

    // Fetch for itineraries
    const fetchItineraries = async (cityId) => {
        try {

            setItinerariesIsLoading(true);
            setItinerariesError(null);

            const responseItineraries = await fetch(`http://localhost:5000/api/itineraries/${cityId}`)

            if (!responseItineraries.ok) {
                const errorData = await responseItineraries.json()
                throw new Error(errorData.message || "Error with request");
            }

            const itinerariesList = await responseItineraries.json();

            setItineraries(itinerariesList);

        } catch (error) {
            setItinerariesError(error.message)
        } finally {
            setItinerariesIsLoading(false);
        }
    }

    return (
        <AppContext.Provider 
            value={{ 
                // Cities
                cities, 
                citiesIsLoading, 
                citiesError, 
                fetchCities, 
                // Itineraries
                itineraries,
                itinerariesIsLoading,
                itinerariesError,
                fetchItineraries
            }}>
            {children}
        </AppContext.Provider>
    )
    
}