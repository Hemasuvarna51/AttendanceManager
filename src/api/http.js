import axios from 'axios';
import {useAuthStore } from '../store/auth.store';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,

});

http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default http;