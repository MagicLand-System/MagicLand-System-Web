import api from "./apiUnlogin";

export const authUser = async ({ phone }) => {
    const response = await api.post("/api/v1/auth", { phone });
    //staff: +84971822094
    //admin: +84963246205
    return response.data;
};
export const register = async (credential) => {
    const response = await api.post("/api/v1/users/register", credential);
    return response.data;
};
export const checkExist = async ({ phone }) => {
    const response = await api.get("/api/v1/userscheckExist", {
        params: {
            phone: phone
        }
    });
    return response.data;
};