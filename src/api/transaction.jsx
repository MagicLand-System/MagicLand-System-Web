import api from './api'
export const getTransactions = async (credential) => {
    const response = await api.get("/api/v1/walletTransactions", {
        params: credential
    });
    return response.data;
};
export const getTransactionsDetail = async (id) => {
    const response = await api.get(`/api/v1/walletTransactions/${id}`);
    return response.data;
};