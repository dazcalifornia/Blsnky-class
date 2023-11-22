// lib/handler/api/classHandler.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4049"; // Replace with your backend API URL

const ClassHandler = {
  createClassroom: async (name: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/classrooms`, {
        name,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  joinClassroom: async (inviteCode: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/classrooms/join`, {
        inviteCode,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getJoinedClassrooms: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/classrooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.joinedClass;
    } catch (error) {
      throw error.response.data;
    }
  },

  getClassroomDetails: async (classroomId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/classrooms/${classroomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.classroom;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default ClassHandler;
