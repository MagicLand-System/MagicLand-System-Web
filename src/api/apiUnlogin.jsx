import axios from "axios";

const url = "https://magic-land-system.azurewebsites.net";
const instance = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
});
export default instance;
