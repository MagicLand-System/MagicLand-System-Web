import Swal from "sweetalert2";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response) {
      if (err.response.status === 401 || err.response.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Hãy đăng nhập để tiếp tục!',
          showConfirmButton: false
        }).then(() => {
          localStorage.removeItem('accessToken');
          window.location.replace("/login")
        })
      }
    }
    return Promise.reject(err);
  }
);

export const refresh = async (oldToken) => {
  const response = await instance.post("/api/v1/auth/refreshToken", { oldToken: oldToken });
  return response.data;
};
