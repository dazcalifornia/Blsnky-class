//feedHandler.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4049"; // Replace with your backend API URL

const feedHandler = {
  getGlobalFeed: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching global feed:", error);
      throw error;
    }
  },
  createPost: async (postData: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/post`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        console.log("Post created successfully");
      } else {
        console.error("Post creation error:", response.data.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },
};

export default feedHandler;
