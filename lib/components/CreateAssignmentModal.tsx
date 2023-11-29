// components/CreateAssignmentModal.tsx
import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, InputNumber, Button } from "antd";
import AssignmentHandler from "@/lib/handler/api/assignMentHandler";

const CreateAssignmentModal = ({
  visible,
  onCancel,
  onCreateAssignment,
  classroomId,
}: {
  visible: boolean;
  onCancel: () => void;
  onCreateAssignment: () => void;
  classroomId: string;
}) => {
  const [form] = Form.useForm();

  const handleCreateAssignment = async () => {
    try {
      const values = await form.validateFields();

      const assignmentData = {
        title: values.title,
        description: values.description,
        scheduled_submission: values.scheduled_submission.format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        max_score: values.max_score,
      };

      // Assuming you have classroomId available in your component
      await AssignmentHandler.createAssignment(classroomId, assignmentData);

      onCreateAssignment();
      onCancel();
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Create Assignment"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleCreateAssignment}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="scheduled_submission"
          label="Scheduled Submission"
          rules={[
            {
              required: true,
              message: "Please select the scheduled submission date and time",
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="max_score"
          label="Max Score"
          rules={[
            { required: true, message: "Please enter the maximum score" },
            { type: "number", min: 0, message: "Please enter a valid number" },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAssignmentModal;
