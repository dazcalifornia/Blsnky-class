"use client";
import React, { useState } from "react";
import {
  FloatButton,
  Modal,
  Form,
  Input,
  message,
  Button,
  Card,
  Divider,
} from "antd";
import { PlusOutlined, LoginOutlined } from "@ant-design/icons";
import ClassHandler from "@/lib/handler/api/classHandler"; // Import the class handler

const Home = () => {
  const [createClassroomModalVisible, setCreateClassroomModalVisible] =
    useState(false);
  const [joinClassroomModalVisible, setJoinClassroomModalVisible] =
    useState(false);

  const showCreateClassroomModal = () => {
    setCreateClassroomModalVisible(true);
  };

  const hideCreateClassroomModal = () => {
    setCreateClassroomModalVisible(false);
  };

  const showJoinClassroomModal = () => {
    setJoinClassroomModalVisible(true);
  };

  const hideJoinClassroomModal = () => {
    setJoinClassroomModalVisible(false);
  };

  const handleCreateClassroom = async (values: any) => {
    console.log("classrooms:", values);
    try {
      await ClassHandler.createClassroom(values);
      message.success("Classroom created successfully");
      hideCreateClassroomModal();
    } catch (error) {
      console.error("Error creating classroom:", error);
      message.error("Failed to create classroom");
    }
  };

  const handleJoinClassroom = async (values: any) => {
    console.log("class Code: ", values);
    try {
      await ClassHandler.joinClassroom(values);
      message.success("Joined classroom successfully");
      hideJoinClassroomModal();
    } catch (error) {
      console.error("Error joining classroom:", error);
      message.error("Failed to join classroom");
    }
  };

  return (
    <>
      <div>
        <Card style={{ width: 300, marginTop: 16 }}>
          <p>Email Teacher : burblanks@gmail.com</p>
          <p>password : 123456</p>
          <Divider />
         
        </Card>
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{ right: 24 }}
          icon={<PlusOutlined />}
          tooltip={<div>menu</div>}
        >
          <FloatButton
            onClick={showCreateClassroomModal}
            tooltip={<div>createClassroom</div>}
          />
          <FloatButton
            icon={<PlusOutlined />}
            onClick={showJoinClassroomModal}
            tooltip={<div>join Class</div>}
          />
        </FloatButton.Group>
      </div>

      {/* Create Classroom Modal */}
      <Modal
        title="Create Classroom"
        visible={createClassroomModalVisible}
        onCancel={hideCreateClassroomModal}
        footer={null}
      >
        <Form name="createClassroom" onFinish={handleCreateClassroom}>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please enter the classroom name" },
            ]}
          >
            <Input placeholder="Classroom Name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Classroom
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Join Classroom Modal */}
      <Modal
        title="Join Classroom"
        visible={joinClassroomModalVisible}
        onCancel={hideJoinClassroomModal}
        footer={null}
      >
        <Form name="joinClassroom" onFinish={handleJoinClassroom}>
          <Form.Item
            name="inviteCode"
            rules={[
              { required: true, message: "Please enter the invite code" },
            ]}
          >
            <Input placeholder="Invite Code" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Join Classroom
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Home;
