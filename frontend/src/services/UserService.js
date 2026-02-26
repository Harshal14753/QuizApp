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