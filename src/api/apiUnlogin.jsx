import axios from "axios";

const url = "https://magiclandapiv2.somee.com";
const instance = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
});
export default instance;
