import React from "react";
import { Inter } from "next/font/google";

import StyledComponentsRegistry from "../lib/AntdRegistry";

import { ThemeProvider } from "./theme/ThemeContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Classroom- System",
  description: "made with care by Burblnks",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body className={inter.className}>
      <StyledComponentsRegistry>
        <ThemeProvider>{children}</ThemeProvider>
      </StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
