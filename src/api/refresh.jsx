import axios from "axios";
import Swal from "sweetalert2";

const URL = "https://magic-land-system.azurewebsites.net";

const instance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Hãy đăng nhập để tiếp tục!',
        }).then(() => {
          localStorage.clear();
          window.location.replace("/login")
        })
      }
    }
    return Promise.reject(err);
  }
);

export const refresh = async (oldToken) => {
  const response = await instance.post("/api/v1/auth/register", oldToken);
  return response.data;
};
