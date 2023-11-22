// classrooms/[id].tsx
"use client";
import React, { useEffect, useState } from "react";
import ClassHandler from "@/lib/handler/api/classHandler";
import { useParams } from "next/navigation";

const ClassroomPage = () => {
  const params = useParams();
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        const classroomDetails = await ClassHandler.getClassroomDetails(
          params.pid.toString()
        );
        setClassroom(classroomDetails);
        console.log("classroomDetails:", classroomDetails);
      } catch (error) {
        console.error("Error fetching classroom details:", error);
      }
    };

    if (params.pid) {
      fetchClassroomDetails();
    }
  }, [params.pid]);

  return (
    <div>
      {classroom ? (
        <div>
          <h1>{classroom.name}</h1>
          {/* Render other details of the classroom */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ClassroomPage;
