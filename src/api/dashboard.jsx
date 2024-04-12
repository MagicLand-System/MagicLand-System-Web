import api from "./api";
export const getNumberOfUser = async () => {
    const response = await api.get(`/api/v1/System/GetNumberOfUser`);
    return response.data;
};
export const getRevenue = async (startDate, endDate) => {
    const response = await api.get(`/api/v1/System/GetRevenue`, { params: { startDate, endDate } });
    return response.data;
};
export const getRegistered = async (startDate, endDate) => {
    const response = await api.get(`/api/v1/System/GetRegistered`, { params: { startDate, endDate } });
    return response.data;
};
export const getFavoriteCourse = async (startDate, endDate) => {
    const response = await api.get(`/api/v1/System/GetFavoriteCourse`, { params: { startDate, endDate } });
    return response.data;
};