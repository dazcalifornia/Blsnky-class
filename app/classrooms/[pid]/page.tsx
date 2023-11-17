// classrooms/[id].tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";

const ClassroomPage = () => {
  const params = useParams();

  console.log("params: ", params);

  return (
    <div>
      <h1>Classroom Page</h1>
      <p>Classroom ID: {params.pid}</p>
    </div>
  );
};

export default ClassroomPage;
