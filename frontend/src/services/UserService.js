import { http } from "../config/AxiosHelper";

export const registerUser = async (formdata) => {
    try {
        const response = await http.post("/auth/register", formdata);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const loginUser = async (formdata) => {
    try {
        const response = await http.post("/auth/login", formdata);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserProfile = async (token) => {
    try {
        const response = await http.get("/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logoutUser = async () => {
    try {
        await http.post("/auth/logout");
        localStorage.removeItem('token');
    } catch (error) {
        throw error;
    }
}

export const getQuizTypes = async () => {
    try {
        const response = await http.get("/auth/quiz-types");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCategories = async () => {
    try {
        const response = await http.get("/auth/categories");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getBasicItemsByType = async (type) => {
    try {
        const response = await http.get(`/auth/basic-items/${type}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getQuizQuestions = async (params) => {
    try {
        const response = await http.get('/auth/questions', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addCoins = async (coins) => {
    try {
        const token = localStorage.getItem('token');
        const response = await http.post('/auth/add-coins', { coins }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}