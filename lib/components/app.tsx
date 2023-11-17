"use client";
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  HomeFilled,
  EditFilled,
} from "@ant-design/icons";

import Home from "@/app/page";
import FeedPage from "@/app/feed/page";

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

const Applayout = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState();
  const onClick: MenuProps["onClick"] = (e) => {
    setSelectedMenu(e.keyPath);
    console.log("click ", e);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width="256">
        <div style={{ width: "auto" }}>
          <div className="logo" />

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={items}
            onClick={onClick}
          />
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
          {selectedMenu === "/" && <Home />}
          {selectedMenu === "/feed" && <FeedPage />}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Essential-Studio ©2023 Created by ESFRANX
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Applayout;
