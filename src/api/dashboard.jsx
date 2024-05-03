import api from "./api";
export const getNumberOfUser = async () => {
    const response = await api.get(`/api/v1/System/GetNumberOfUser`);
    return response.data;
};
export const getRevenue = async (startDate, endDate) => {
    const response = await api.get(`/api/v1/System/GetRevenue`, { params: { startDate, endDate } });
    return response.data;
};
export const getFavoriteCourse = async (startDate, endDate) => {
    const response = await api.get(`/api/v1/System/GetFavoriteCourse`, { params: { startDate, endDate } });
    return response.data;
};
export const getRegistered = async (quarter) => {
    const response = await api.get(`/api/v1/System/GetRegistered`, { params: { quarter } });
    return response.data;
};
export const getRegisteredCourse = async (quarter, courseId) => {
    const response = await api.get(`/api/v1/System/GetRegistered`, { params: { quarter, courseId } });
    return response.data;
};