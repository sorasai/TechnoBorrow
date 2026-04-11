import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/borrowing-requests';

export const borrowingApi = {

    /**
     * Create a new borrowing request
     */
    createRequest: async (requestData: any) => {
        try {
            const response = await axios.post(API_BASE_URL, requestData);
            return response.data;
        } catch (error) {
            console.error('Error creating borrowing request:', error);
            throw error;
        }
    },

    /**
     * Get all borrowing requests
     */
    getAllRequests: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching borrowing requests:', error);
            throw error;
        }
    }
};
