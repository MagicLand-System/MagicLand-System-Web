import api from "./api";
export const getQuiz = async (id) => {
    const response = await api.get(`/api/v1/${id}/staff/get`);
    return response.data;
};