// lib/handler/api/userHandler.ts

import axios from "axios";

const API_BASE_URL = "http://localhost:4049";
//const API_BASE_URL = "http://server.franx.dev"; // Replace with your backend API URL

const UserHandler = {
  getAdminRoute: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createOrUpdateProfile: async (profileData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getUserRole: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user-role`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default UserHandler;
