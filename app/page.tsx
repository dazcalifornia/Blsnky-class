import React from "react";
import { Button } from "antd";
import Applayout from "@/lib/components/app";
export default function Home() {
  return (
    <Applayout>
      <Button type="primary">Button</Button>
      <p>Hello</p>
    </Applayout>
  );
}
