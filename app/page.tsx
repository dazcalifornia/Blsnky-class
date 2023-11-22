"use client";
import React from "react";
import { Button } from "antd";
import Applayout from "@/lib/components/app";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1>This is a homepage</h1>
      <p>Hello</p>
    </div>
  );
}
