import axios from "axios";
import { getTime } from "./time";
import MockDate from "mockdate";

const url = import.meta.env.VITE_API_URL;
const instance = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
    },
});
instance.interceptors.request.use(
    async (config) => {
        // if (config.url !== "/System/GetTime") {
        //     const time = await getTime();
        //     MockDate.set(new Date(time))
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default instance;
