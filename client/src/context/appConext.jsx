// src/context/appConext.jsx
import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState('');

    const getUserData = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
            if (res.data.success) {
                setUserData(res.data.userData);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log("Error in getUserData:", error.message);
        }
    };

    const getAuthState = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/auth/is-auth`, { withCredentials: true });
            if (res.data.success) {
                setIsLoggedin(true);
                getUserData();
            } else {
                setIsLoggedin(false);
            }
        } catch (error) {
            console.log("Error in getAuthState:", error.message);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
