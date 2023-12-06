import axios from "axios";

const API_BASE_URL = "http://localhost:4049"; // Replace with your backend API URL

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
};

export default WorkspaceHandler;
