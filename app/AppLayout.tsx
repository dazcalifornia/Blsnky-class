"use client";

import {
  Layout,
  Menu,
  Button,
  ConfigProvider,
  Avatar,
  Modal,
  Form,
  Input,
} from "antd";
import {
  HomeOutlined,
  HeartOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "./theme/theme"; // Update with the correct path

import Link from "next/link";

const { Header, Sider, Content, Footer } = Layout;

const routes = [
  { key: "1", path: "/", label: "Home", icon: <HomeOutlined /> },
  { key: "2", path: "/feed", label: "Feed", icon: <HeartOutlined /> },
  {
    key: "3",
    path: "/classrooms",
    label: "Classrooms",
    icon: <AppstoreOutlined />,
  },
];

const AppLayout = ({ children, selected }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formType, setFormType] = useState("login"); // "login" or "register"

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      setIsDarkTheme(true);
    }
  }, []);

  const debouncedToggleTheme = () => {
    setTimeout(() => {
      setIsDarkTheme((prevTheme) => !prevTheme);
      localStorage.setItem("theme", isDarkTheme ? "light" : "dark");
    }, 300); // Adjust the debounce delay as needed
  };

  const handleToggleTheme = () => {
    debouncedToggleTheme();
  };

  const showLoginModal = () => {
    setIsModalVisible(true);
    setFormType("login");
  };

  const showRegisterModal = () => {
    setIsModalVisible(true);
    setFormType("register");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = (values) => {
    // Handle login or register logic here
    console.log("Received values:", values);
    setIsModalVisible(false);
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  const styles = {
    minHeight: "100vh",
    ...theme,
  };

  return (
    <ConfigProvider theme={theme}>
      <Layout style={styles}>
        <Sider collapsible collapsed={collapsed} onCollapse={toggleSidebar}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[selected]}>
            {routes.map(({ key, path, label, icon }) => (
              <Menu.Item key={key} icon={icon}>
                <Link href={path}>
                  <p>{label}</p>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Button onClick={handleToggleTheme}>Toggle Theme</Button>
            </div>
            <div>
              <Avatar
                icon={<UserOutlined />}
                style={{ cursor: "pointer" }}
                onClick={showLoginModal}
              />
            </div>
          </Header>
          <Content style={{ margin: "16px" }}>{children}</Content>
          <Footer style={{ textAlign: "center" }}>Footer Content</Footer>
        </Layout>

        <Modal
          title={formType === "login" ? "Login" : "Register"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form name={formType} onFinish={handleFormSubmit}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            {formType === "register" && (
              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("The two passwords do not match!");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {formType === "login" ? "Login" : "Register"}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            {formType === "login" ? (
              <p>
                Don't have an account?{" "}
                <Button type="link" onClick={showRegisterModal}>
                  Register now
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button type="link" onClick={showLoginModal}>
                  Login here
                </Button>
              </p>
            )}
          </div>
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
