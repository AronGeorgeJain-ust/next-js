import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong.";

    const titles = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Access Denied",
      404: "Not Found",
      409: "Conflict",
      500: "Server Error",
    };

    const title = titles[error.response?.status];

    if (title) {
      if (title === message) {
        alert(message);
      } else {
        alert(`${title}\n\n${message}`);
      }
    } else {
      alert(message);
    }

    return Promise.reject(error);
  }
);

export default api;