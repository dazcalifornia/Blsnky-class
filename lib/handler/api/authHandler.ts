// authHandler.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4049";
//const API_BASE_URL = "https://server.franx.dev"; // Replace with your backend API URL

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string; // Optionally, include the user role
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, data);
    return response.data;
  } catch (error:any) {
    return Promise.reject(error.response.data);
  }
};

export const login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error:any) {
    return Promise.reject(error.response.data);
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.post(`${API_BASE_URL}/logout`, null, {
      headers,
    });
    //remove token from local localStorage
    localStorage.removeItem("token");
    return response.data;
  } catch (error:any) {
    return Promise.reject(error.response.data);
  }
};
