import api from "./api";
export const getRoomSchedule = async (credential) => {
    const response = await api.get("/api/v1/rooms/admin/get", {
        params: credential
    });
    return response.data;
};
export const getRoomDailySchedule = async (credential) => {
    const response = await api.get("/api/v1/rooms/v2/admin/get", {
        params: credential
    });
    return response.data;
};