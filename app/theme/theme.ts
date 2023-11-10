import type { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
  token: {
    colorBgBase: "#ddf4f4",
    colorLink: "#f49b9b",
    colorPrimary: "#13c2c2",
    colorInfo: "#1a957a",
    colorTextBase: "#000000",
    wireframe: false,
    borderRadius: 16,
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorBgBase: "#182d3b",
    colorLink: "#ffdd00",
    colorPrimary: "#13c2c2",
    colorInfo: "#00ffc7",
    colorTextBase: "#ffffff",
    wireframe: false,
    borderRadius: 16,
  },
};
