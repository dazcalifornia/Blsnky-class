import axios from "axios";

const API_BASE_URL = "http://localhost:4049";
//const API_BASE_URL = "http://server.franx.dev"; // Replace with your backend API URL

const WorkspaceHandler = {
  getWorkspaces: async (classId: any) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/workspaces?classId=${classId}`, // Pass classId as a query parameter
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw error;
    }
  },

  createWorkspace: async (name: any, description: any, classId: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/workspaces`,
        {
          name,
          description,
          classId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  },

  inviteUserToWorkspace: async (workspaceId: any, email: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/workspaces/invite`,
        {
          workspaceId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error inviting user to workspace:", error);
      throw error;
    }
  },

  addUserToWorkspace: async (workspaceId: any, email: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/workspaces/add-user`,
        {
          workspaceId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding user to workspace:", error);
      throw error;
    }
  },

  createPost: async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/workspaces/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      if (response.status === 201) {
        console.log("Post created successfully");
        return response.data;
      } else {
        console.error("Post creation error:", response.data.error);
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  createComment: async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/workspaces/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  uploadFile: async (workspaceId: any, userId: any, postId: any, file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_BASE_URL}/api/workspaces/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          params: {
            workspaceId,
            userId,
            postId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  getWorkspaceDetails: async (id: any) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/workspaces/details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("error:", err);
      throw err;
    }
  },
  getPosts: async (workspaceId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/workspaces/posts/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  getComments: async (postId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/workspaces/comments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
};

export default WorkspaceHandler;
