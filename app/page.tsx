"use client";
import React from "react";
import { Button } from "antd";
import Applayout from "@/lib/components/app";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const goToClassroom = () => {
    // Replace '123' with the actual classroom ID you want to pass
    router.push("/classrooms/123");
  };

  const classrooms = [{ id: "1" }, { id: "2" }, { id: "3" }];
  return (
    <div>
      <h1>This is a homepage</h1>
      <Button type="primary" onClick={goToClassroom}>
        Button
      </Button>

      {classrooms.map((classroom) => (
        <li key={classroom.id}>
          <Link href={`/classrooms/${classroom.id}`}>
            <p>{`Classroom ${classroom.id}`}</p>
          </Link>
        </li>
      ))}
      <p>Hello</p>
    </div>
  );
}
