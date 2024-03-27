import Swal from "sweetalert2";
import api from "./apiUnlogin";

api.interceptors.response.use(
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
  const response = await api.post("/api/v1/auth/refreshToken", { oldToken: oldToken });
  return response.data;
};
