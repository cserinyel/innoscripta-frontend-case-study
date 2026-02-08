import axios, { AxiosError } from "axios";
import type { ApiError } from "./types";

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: "An unexpected error occurred",
      status: error.response?.status,
    };

    if (error.response) {
      const data = error.response.data as Record<string, unknown> | undefined;
      apiError.message =
        (data?.message as string) ??
        `Request failed with status ${error.response.status}`;
    } else if (error.request) {
      apiError.message =
        "No response received from the server. Please check your connection.";
    } else {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  },
);

export default axiosInstance;
