import React from "react";

import AppLayout from "./AppLayout";

import Link from "next/link";
export default function Home() {
  return (
    <AppLayout selected="1">
      <Link href="/feed">Feed</Link>
    </AppLayout>
  );
}
