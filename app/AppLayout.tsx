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
  SmileFilled,
} from "@ant-design/icons";

import { usePathname, useRouter } from "next/navigation";

import { Button, Layout, Menu, MenuProps, Popover, message } from "antd";

import AuthModal from "@/lib/components/AuthModal";
import { logout } from "@/lib/handler/api/authHandler";
import ClassHandler from "@/lib/handler/api/classHandler";
import UserHandler from "@/lib/handler/api/userHandler";

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

const AppLayout = ({ children }: any) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userState, setUserState] = useState(false);
  const [joinedClassrooms, setJoinedClassrooms] = useState<number[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [ownClass, setOwnClass] = useState<any[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserState(true);

      fetchOwnedClass();
      // Fetch joined classrooms when authenticated
      if (userRole === "teacher") {
      } else if (userRole === "user") {
        fetchJoinedClassrooms();
      }
      fetchUserRole();
    }
  }, [userState, userRole]);

  const fetchOwnedClass = async () => {
    try {
      const res = await ClassHandler.getOwnClassrooms();
      setOwnClass(res || []);
      console.log("ownedClass: ", res);
    } catch (error) {
      console.log("Error fetching ownedClass:", error);
    }
  };

  const fetchJoinedClassrooms = async () => {
    try {
      const response = await ClassHandler.getJoinedClassrooms();
      setJoinedClassrooms(response || []); // Provide a default empty array
      console.log("response:", response);
      console.log("joinedClass:", joinedClassrooms);
    } catch (error) {
      console.error("Error fetching joined classrooms:", error);
    }
  };
  const fetchUserRole = async () => {
    try {
      const response = await UserHandler.getUserRole();
      setUserRole(response.role || ""); // Provide a default empty string

      console.log("userRole:", response.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

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
      setJoinedClassrooms([]); // Clear joined classrooms
      message.success("logout successful");
      router.push("/"); // Navigate to "/"
    });
  };
  // Function to get menu items based on joined classrooms and user role
  const getLoggedInItems = (
    joinedClassrooms: number[] = [],
    userRole: string = ""
  ): MenuItem[] => {
    const classroomItems: MenuItem[] = joinedClassrooms.map((classroomId) => {
      return getItem(
        `Classroom ${classroomId}`,
        `/classrooms/${classroomId}`,
        <ExperimentFilled />
      );
    });

    const userClassroomsGroup: MenuItem = getItem(
      "Your Joined Classrooms",
      "sub1",
      <ExperimentFilled />,
      classroomItems,
      "group"
    );

    const ownedClassItems: MenuItem[] = ownClass.map((classroomId) => {
      return getItem(
        `Classroom ${classroomId.id}`,
        `/classrooms/${classroomId.id}`,
        <ExperimentFilled />
      );
    });

    const teacherClassGroup: MenuItem = getItem(
      "Your created classes",
      "ownerClass",
      <ExperimentFilled />,
      ownedClassItems,
      "group"
    );

    if (userRole === "admin") {
      return [
        getItem(`Home Logged as : ${userRole}`, "", <HomeFilled />),
        getItem("ADMIN", "/admin", <SmileFilled />),
      ];
    }
    // Check if the user is a teacher or admin
    if (userRole === "teacher") {
      return [
        getItem(`Logged as : ${userRole}`, "", <UserOutlined />),
        getItem("Home", "/", <HomeFilled />),
        getItem("Feeds", "/feed", <EditFilled />),
        getItem("Your Class", "ownedClass", <SmileFilled />, [
          teacherClassGroup,
        ]),
      ];
    } else {
      // Return a reduced set of menu items for non-teacher or non-admin users
      return [
        getItem(`Logged as : ${userRole}`, "", <UserOutlined />),

        getItem("Home", "/", <HomeFilled />),
        getItem("Feeds", "/feed", <EditFilled />),
        getItem("Joined Classroom", "joinedClass", <SmileFilled />, [
          userClassroomsGroup,
        ]),
      ];
    }
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
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ width: "auto" }}>
            <div className="logo" />

            <p></p>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={[`${pathname}`]}
              items={
                userState ? getLoggedInItems(joinedClassrooms, userRole) : items
              }
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
              position: "sticky",
              top: 0,
              zIndex: 1,
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
            HI:D
          </Footer>
        </Layout>
      </Layout>
      <AuthModal visible={authModalVisible} onClose={hideAuthModal} />
    </>
  );
};

export default AppLayout;
