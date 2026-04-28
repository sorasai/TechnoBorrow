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
            const response = await axios.post(`http://localhost:8080/api/offers`, {
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
            const response = await axios.get(`http://localhost:8080/api/offers/request/${requestId}`);
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
            const response = await axios.get(`http://localhost:8080/api/offers/user/${userId}`);
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
            const response = await axios.post(`http://localhost:8080/api/offers/${offerId}/accept`);
            return response.data;
        } catch (error) {
            console.error('Error accepting offer:', error);
            throw error;
        }
    }
};
