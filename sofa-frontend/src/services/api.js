import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const getSofas = async () => {
    try {
        const response = await axios.get(`${API_URL}sofas/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sofas:", error);
        return [];
    }
};