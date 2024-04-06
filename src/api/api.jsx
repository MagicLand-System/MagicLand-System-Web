import axios from "axios";
import { refresh } from "./refresh";
import { getTime } from "./time";
import MockDate from "mockdate";

const url = "https://a792-118-69-69-187.ngrok-free.app";
const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

instance.interceptors.request.use(
  async (config) => {
    if (config.url !== "/System/GetTime") {
      const time = await getTime();
      MockDate.set(new Date(time))
    }
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const oldToken = localStorage.getItem("accessToken");
          const data = await refresh(oldToken)
          const accessToken = data.token;
          localStorage.setItem("accessToken", accessToken);

          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
