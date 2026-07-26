let startLoadingFn = null;
let stopLoadingFn = null;

export const initApiFetch = (start, stop) => {
    startLoadingFn = start;
    stopLoadingFn = stop;
};

export const apiFetch = async (url, options = {}) => {
    if (startLoadingFn) startLoadingFn();
    try {
        return await fetch(url, options);
    } finally {
        if (stopLoadingFn) stopLoadingFn();
    }
};