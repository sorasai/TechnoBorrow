import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_BASE_URL = `${API_URL}/borrowing-requests`;

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
            return response.data.map((req: any) => req.status === 'ONGOING' ? { ...req, status: 'MATCHED' } : req);
        } catch (error) {
            console.error('Error fetching borrowing requests:', error);
            throw error;
        }
    },

    /**
     * Create an offer for a request
     */
    createOffer: async (requestId: number, lenderId: number, message: string) => {
        try {
            const response = await axios.post(`${API_URL}/offers`, {
                requestId,
                lenderId,
                message
            });
            return response.data;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    },

    /**
     * Get offers for a specific request
     */
    getOffersForRequest: async (requestId: number) => {
        try {
            const response = await axios.get(`${API_URL}/offers/request/${requestId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching offers for request:', error);
            throw error;
        }
    },

    /**
     * Get offers made by a user
     */
    getOffersForUser: async (userId: number) => {
        try {
            const response = await axios.get(`${API_URL}/offers/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user offers:', error);
            throw error;
        }
    },

    /**
     * Accept an offer
     */
    acceptOffer: async (offerId: number) => {
        try {
            const response = await axios.post(`${API_URL}/offers/${offerId}/accept`);
            return response.data;
        } catch (error) {
            console.error('Error accepting offer:', error);
            throw error;
        }
    },

    /**
     * Confirm borrow receipt
     */
    confirmBorrow: async (requestId: number) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${requestId}/borrow`);
            return response.data;
        } catch (error) {
            console.error('Error confirming borrow receipt:', error);
            throw error;
        }
    },

    /**
     * Confirm return
     */
    confirmReturn: async (requestId: number, userId: number) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${requestId}/return?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error confirming return:', error);
            throw error;
        }
    }
};
