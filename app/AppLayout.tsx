"use client";

import React, { useEffect, useState } from "react";

//import class
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeFilled,
  EditFilled,
  ExperimentFilled,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { usePathname, useRouter } from "next/navigation";

import { Button, Layout, Menu, MenuProps, Popover, message } from "antd";

import AuthModal from "@/lib/components/AuthModal";
import { logout } from "@/lib/handler/api/authHandler";

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

const items: MenuProps["items"] = [getItem("Home", "/", <HomeFilled />)];

const loggedInItems: MenuProps["items"] = [
  getItem("Home", "/", <HomeFilled />),
  getItem("Feeds", "/feed", <EditFilled />),
  getItem("Your Classroom", "sub1", <ExperimentFilled />, [
    getItem("Math Class", "/classrooms/123", null),
  ]),
];

const AppLayout = ({ children }: any) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userState, setUserState] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserState(true);
    }
    console.log("userState:", userState);
  }, [userState]);

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(`${e.keyPath[0]}`);
    console.log("click ", e);
  };

  const showAuthModal = () => {
    setAuthModalVisible(true);
  };

  const hideAuthModal = () => {
    setAuthModalVisible(false);
  };

  const handleLogout = () => {
    console.log("logout");
    logout().then(() => {
      setUserState(false);
      message.success("logout successful");

      router.push("/"); // Navigate to "/"
    });
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          width="256"
        >
          <div style={{ width: "auto" }}>
            <div className="logo" />

            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={[`${pathname}`]}
              items={userState ? loggedInItems : items}
              onClick={onClick}
            />
          </div>
        </Sider>
        <Layout>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 0,
              backgroundColor: "white",
            }}
          >
            <div>
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
            </div>
            <div>
              {token ? (
                <Popover
                  content={
                    <Button
                      type="text"
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  }
                >
                  <Button
                    type="text"
                    icon={<UserOutlined />}
                    style={{ fontSize: "16px", width: 64, height: 64 }}
                  />
                </Popover>
              ) : (
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  onClick={showAuthModal}
                  style={{
                    fontSize: "16px",
                    marginRight: "16px",
                  }}
                >
                  Login / Register
                </Button>
              )}
            </div>
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
      <AuthModal visible={authModalVisible} onClose={hideAuthModal} />
    </>
  );
};

export default AppLayout;
