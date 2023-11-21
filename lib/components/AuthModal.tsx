// components/AuthModal.tsx
import React, { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message, Popover } from "antd";
import { register, login } from "@/lib/handler/api/authHandler";

const { TabPane } = Tabs;

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const onFinish = async (values: any) => {
    try {
      if (activeTab === "login") {
        await login(values);
        message.success("Login successful");

        onClose(); // Close the modal after successful Login
        window.location.reload();

        if (onLoginSuccess) {
          onLoginSuccess(); // Trigger the callback function
        }
      } else {
        await register(values);
        message.success("Registration successful");
      }
    } catch (error) {
      // Handle errors, e.g., display error messages to the user
      console.error("Authentication error:", error);
    }
  };

  return (
    <Modal
      title="Login / Register"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Tabs
        defaultActiveKey="login"
        activeKey={activeTab}
        onChange={handleTabChange}
      >
        <TabPane tab="Login" key="login">
          <Form name="login" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Register" key="register">
          <Form name="register" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AuthModal;
