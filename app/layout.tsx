import type { Metadata } from "next";

import React from "react";
import { Kanit } from "next/font/google";

import "./globals.css";

const kanit = Kanit({
  weight: ["400", "700", "500"],
  subsets: ["thai", "latin"],
});

//import ant
import StyledComponentsRegistry from "../lib/AntdRegistry";
import { ConfigProvider } from "antd";
import theme from "./theme/themeConfig";

import AppLayout from "./AppLayout";

export const metadata: Metadata = {
  title: "Blnksy-class",
  description: "Created by franx <3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta http-equiv="Access-Control-Allow-Origin" content="*" />
      </head>
      <body className={kanit.className}>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            <AppLayout>{children}</AppLayout>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
