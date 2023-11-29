// AssignmentSubmissionForm.tsx
import React, { useState } from "react";
import { Form, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AssignmentSubmissionForm = ({ onSubmit }: any) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const postData = new FormData();

    try {
      const { assignmentFiles } = values;
      assignmentFiles.forEach((files: any) => {
        postData.append("assignmentFile", files.originFileObj);
      });
      await onSubmit(postData);
      message.success("Assignments submitted successfully");
      form.resetFields();
    } catch (error) {
      message.error("Failed to submit assignments");
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form
      form={form}
      name="assignmentSubmission"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="assignmentFiles"
        label="Assignment Files"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[
          {
            required: true,
            message: "Please upload your assignment files",
          },
        ]}
      >
        <Upload
          name="assignmentFiles"
          beforeUpload={() => false} // Prevent file upload before form submission
          multiple
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Assignments
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AssignmentSubmissionForm;
