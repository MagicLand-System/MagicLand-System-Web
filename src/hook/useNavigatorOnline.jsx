import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const getOnlineStatus = () =>
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

export const useNavigatorOnline = () => {
    const [status, setStatus] = useState(getOnlineStatus());

    const setOnline = () => setStatus(true);
    const setOffline = () => setStatus(false);

    useEffect(() => {
        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        }
    }, [])
    return status;
}
