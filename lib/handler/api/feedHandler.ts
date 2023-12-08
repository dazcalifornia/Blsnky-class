//feedHandler.ts
import axios from "axios";

//const API_BASE_URL = "http://localhost:4049";
const API_BASE_URL = "http://server.franx.dev"; // Replace with your backend API URL

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
    console.log("postData:", postData);
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
  createClassroomFeed: async (classroomId: string, name: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/classrooms/${classroomId}/feeds`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error:any) {
      console.error("Error creating classroom feed:", error);
      throw error.response.data;
    }
  },

  getClassroomFeeds: async (classroomId: string) => {
    try {
      console.log("getClassroomFeeds:", classroomId);
      const response = await axios.get(
        `${API_BASE_URL}/api/classrooms/${classroomId}/feeds`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.results;
    } catch (error:any) {
      console.error("Error fetching classroom feeds:", error);
      throw error.response.data;
    }
  },

  getFeedPosts: async (classroomId: string, feedId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/classrooms/${classroomId}/feeds/${feedId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.results;
    } catch (error:any) {
      console.error("Error fetching feed posts:", error);
      throw error.response.data;
    }
  },

  createFeedPost: async (
    classroomId: string,
    feedId: string,
    content: string
  ) => {
    console.log("data:", content);
    console.log("classId:", classroomId);
    console.log("feedId:", feedId);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/classrooms/${classroomId}/feeds/${feedId}/posts`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error:any) {
      console.error("Error creating feed post:", error);
      throw error.response.data;
    }
  },
};

export default feedHandler;
