import React from "react";
import { Button } from "antd";
import Applayout from "@/lib/components/app";
import { useRouter } from "next/router";

export default function Home() {
  return (
    <div>
      <Button type="primary">Button</Button>
      <p>Hello</p>
    </div>
  );
}
