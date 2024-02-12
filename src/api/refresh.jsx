import axios from "axios";
import Swal from "sweetalert2";

const URL = "https://magiclandapiv2.somee.com";

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
      if (err.response.status === 401 || err.response.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Hãy đăng nhập để tiếp tục!',
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
