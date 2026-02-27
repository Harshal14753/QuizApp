import { http } from "../config/AxiosHelper"


export const loginAdmin = async (formdata) => {
    try {
        const response = await http.post("/admin/login", formdata);
        console.log('Admin login response:', response)  
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await http.get("/admin/users");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserById = async (id) => {
    try {
        const response = await http.get(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (id, formdata) => {
    try {
        const response = await http.put(`/admin/users/${id}`, formdata);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await http.delete(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }   
}

// Admin

export const getAdminProfile = async (token) => {
    try {
        const response = await http.get('/admin/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error){
        throw error
    }
}

export const changeAdminPassword = async (formdata) => {
    try {
        const response = await http.put('/admin/profile/password', formdata)
        return response.data
    } catch (error) {
        throw error
    }
}

export const logout = async (token) => {
    try {
        await http.post("/admin/logout");
        localStorage.removeItem('token');
    } catch (error) {
        throw error;
    }
}


// Question 


export const getQuestionsByType = async (quizType) => {
    try {
        const response = await http.get(`/admin/${quizType}/questions`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getQuestionById = async (quizType, id) => {
    try {
        const response = await http.get(`/admin/${quizType}/question/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}


export const createQuestion = async (quizType, formdata) => {
    try {
        const response = await http.post(`/admin/${quizType}/question`, formdata)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateQuestion = async (quizType, id, formdata) => {
    try {
        const response = await http.put(`/admin/${quizType}/question/${id}`, formdata)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteQuestion = async (quizType, id) => {
    try {
        const response = await http.delete(`/admin/${quizType}/question/${id}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Basic Item

export const getBasicItemsByType = async (basicItem) => {
    try {
        const response = await http.get(`/admin/basic-item/${basicItem}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getBasicItemById = async (basicItem, id) => {
    try {
        const response = await http.get(`/admin/basic-item/${basicItem}/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createBasicItem = async (basicItem, formdata) => {
    try {
        const response = await http.post(`/admin/basic-item/${basicItem}`, formdata)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateBasicItem = async (basicItem, id, formdata) => {
    try {
        const response = await http.put(`/admin/basic-item/${basicItem}/${id}`, formdata)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteBasicItem = async (basicItem, id) => {
    try {
        const response = await http.delete(`/admin/basic-item/${basicItem}/${id}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}
