import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';
const CURRENT_USER_KEY = 'technoborrow_current_user';

export const authApi = {
    // Session Management
    setCurrentUser: (user: any) => {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    },
    
    getCurrentUser: () => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
    
    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // API Calls
    register: async (userData: { email: string; passwordHash: string; fullName: string }) => {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        return response.data;
    },

    getProfile: async (id: number) => {
        const response = await axios.get(`${API_BASE_URL}/profile/${id}`);
        return response.data;
    },

    editProfile: async (id: number, updatedData: { fullName: string }) => {
        const response = await axios.put(`${API_BASE_URL}/profile/edit/${id}`, updatedData);
        return response.data;
    },

    changePassword: async (id: number, body: { newPassword: string }) => {
        const response = await axios.put(`${API_BASE_URL}/profile/password/${id}`, body);
        return response.data;
    },

    uploadPhoto: async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE_URL}/profile/upload/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
