"use client";

//import type { Metadata } from "next";

import React, { useState } from "react";
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

//import class
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeFilled,
  EditFilled,
} from "@ant-design/icons";

import { usePathname, useRouter } from "next/navigation";

import { Button, Layout, Menu, MenuProps } from "antd";

const { Header, Sider, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Home", "/", <HomeFilled />),
  getItem("Feeds", "/feed", <EditFilled />),
];

//export const metadata: Metadata = {
//  title: "Blnksy-class",
//  description: "Created by franx <3",
//};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const onClick: MenuProps["onClick"] = (e) => {
    router.push(`${e.keyPath[0]}`);

    console.log("click ", e);
  };

  return (
    <html lang="en">
      <body className={kanit.className}>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            <Layout style={{ minHeight: "100vh" }}>
              <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width="256"
              >
                <div style={{ width: "auto" }}>
                  <div className="logo" />

                  <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[`${pathname}`]}
                    items={items}
                    onClick={onClick}
                  />
                </div>
              </Sider>
              <Layout>
                <Header style={{ padding: 0 }}>
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: "16px",
                      width: 64,
                      height: 64,
                    }}
                  />
                </Header>
                <Content
                  style={{
                    margin: "24px 16px 0",
                    padding: 24,
                  }}
                >
                  {children}
                </Content>
                <Footer style={{ textAlign: "center" }}>
                  Essential-Studio ©2023 Created by ESFRANX
                </Footer>
              </Layout>
            </Layout>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
