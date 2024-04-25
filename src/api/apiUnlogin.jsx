import axios from "axios";

const url = import.meta.env.VITE_API_URL;
const instance = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
    },
});
export default instance;
