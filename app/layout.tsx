import type { Metadata } from "next";
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
      <body className={kanit.className}>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
