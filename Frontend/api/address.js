import axios, { Axios } from "axios";
import { deleteCookie, getCookie, setCookie } from "./cookies";
import Cookies from "js-cookie";
export const setToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
axios.defaults.baseURL = "http://localhost:3333";

// axios.interceptors.response.use(
// 	(response) => {
// 		if (response && response.status < 500) {
// 			return response;
// 		}
// 		throw new Error(
// 			response?.errors || "Response not handle"
// 		);
// 	},
// 	(error) => {
// 		const { response } = error;
// 		if (response && [401, 403].includes(response.status)) {
// 			if (typeof window !== "undefined")
// 				window.localStorage?.removeItem("token");
// 			deleteCookie("token");
// 			window.location.href = "/login";
// 		}
// 		// throw error
// 	}
// );

axios.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("token");
    const refreshToken = Cookies.get("rf_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!token && refreshToken) {
      const result = await Axios.post(
        "http://localhost:3000/auth/refresh-token",
        {
          refresh_token: refreshToken,
        }
      );
      if (result?.data?.access_token) {
        Cookies.set("token", result?.data?.access_token?.value, {
          expires: result?.data?.access_token?.expires_in / 86400,
        });
        config.headers.Authorization = `Bearer ${result?.data?.access_token?.value}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getListTodos = () => {
  return axios.get("/todos");
};

export const createTodo = (params) => {
  return axios.post("/todos", params);
};

export const updateTodo = (id, params) => {
  return axios.put(`/todos/${id}`, params);
};

export const createUser = (params) => {
  return axios.post("/users", params);
};

export const login = (params) => {
  return axios.post("/auth/login", params);
};

export const listBox = () => {
  return axios.get("/rooms");
};

export const getListUsers = () => {
  return axios.get("/users");
};

export const createRoom = (params) => {
  return axios.post("/rooms", params);
};

export const listMessageByRoom = (id, params) => {
  return axios.get(`/messages/${id}`, { params });
};
