// lib/handler/api/AssignmentHandler.ts

import axios from "axios";

const API_BASE_URL = "http://localhost:4049"; // Replace with your backend API URL

const AssignmentHandler = {
  createAssignment: async (
    classroomId: string,
    assignmentData: {
      title: string;
      description: string;
      scheduled_submission: string;
      max_score: number;
    }
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/classrooms/${classroomId}/assignments`,
      assignmentData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  },

  listAssignments: async (classroomId: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/classrooms/${classroomId}/assignments`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.assignments;
  },

  submitAssignment: async (
    classroomId: string,
    assignmentId: string,
    assignmentFile: FormData
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/classrooms/${classroomId}/assignments/${assignmentId}/submit`,
      assignmentFile,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  },

  scoreAssignment: async (
    classroomId: string,
    assignmentId: string,
    submissionId: string,
    score: number,
    feedback: string
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/classrooms/${classroomId}/assignments/${assignmentId}/score`,
      {
        submissionId,
        score,
        feedback,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  },

  getAssignmentScoresAndFeedback: async (
    classroomId: string,
    assignmentId: string
  ) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/classrooms/${classroomId}/assignments/${assignmentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data.scoresAndFeedback;
  },

  reportPlagiarism: async (
    classroomId: string,
    assignmentId: string,
    submissionId: string,
    reportReason: string
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/classrooms/${classroomId}/assignments/${assignmentId}/report-plagiarism`,
      {
        submissionId,
        reportReason,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  },
  listSubmittedAssignmentEachClass: async (assignmentId: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/classrooms/assignments/${assignmentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  },
};

export default AssignmentHandler;
