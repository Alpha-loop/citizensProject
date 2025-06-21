import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { navigationRef } from '../utils/navigationRef';



const api = axios.create({
    baseURL: 'https://churchplusv3coreapi.azurewebsites.net/mobile/v1/',
    timeout: 500000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Modify config before sending request
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Return response data
        return response;
    },
    (error) => {
        // Handle response error
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Response error:', error.response.status);
            console.error('Response data:', error.response.data);
            if (error.response.status === 401) {
                console.log('Session expired')
                logOut()
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);


export const setUserAuthToken = async (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const logOut = async () => {
    // const dispatch = useDispatch();
    await AsyncStorage.removeItem("user");
    // dispatch(logout());
    setTimeout(() => {
        navigationRef.current?.navigate("Login");
    }, 500);
}

export default api;