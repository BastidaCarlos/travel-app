import { useState, useCallback, useRef, useEffect } from "react";

function useFetch(fetchFunction, resetKey) {
    const [ data, setData ] = useState([]);
    const [ loadingFetch, setLoadingFetch ] = useState(false);
    const [ fetchError, setFetchError ] = useState('');
    const hasFetched = useRef(false);

    useEffect(() => {
        hasFetched.current = false;
    }, [resetKey])

    const execute = useCallback(async () => {
        if (hasFetched.current) return; 

        setLoadingFetch(true);
        setFetchError('');

        try {
            const result = await fetchFunction();
            setData(result);
            hasFetched.current = true;
        } catch (error) {
            setFetchError(error.message || "An error occurred while loading the data")
        } finally {
            setLoadingFetch(false);
        }
    }, [fetchFunction]);

    return { data, setData, loadingFetch, fetchError, execute };
}

export default useFetch;