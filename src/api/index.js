import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://magic-land-system.azurewebsites.net/api/v1/",
  // các thiết lập khác
});
export default axiosInstance;
