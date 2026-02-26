import axios from "axios"

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const http = axios.create({
    baseURL: BASE_URL,
})

// Automatically attach the token to every request
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})