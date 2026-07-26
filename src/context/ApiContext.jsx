import { createContext, useState, useEffect } from 'react';
import { initApiFetch } from './apiFetch';
import { Spinner } from '../components/Spinner';

const ApiContext = createContext();

export function ApiProvider({ children }) {
    const [activeRequests, setActiveRequests] = useState(0);

    const startLoading = () => setActiveRequests((prev) => prev + 1);
    const stopLoading = () => setActiveRequests((prev) => Math.max(0, prev - 1));

    useEffect(() => {
        initApiFetch(startLoading, stopLoading);
    }, []);

    const isLoading = activeRequests > 0;

    return (
        <ApiContext.Provider value={{ isLoading }}>
            {children}

            {/* Global Overlay */}
            {isLoading && (
                <div className="global-loading-overlay">
                    <Spinner text="Processing..." />
                </div>
            )}
        </ApiContext.Provider>
    );
}