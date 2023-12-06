// Example: CreateWorkspaceForm.js
import React from 'react';
import { Form, Input, Button } from 'antd';

const CreateWorkspaceForm = ({ onCreateWorkspace }:any) => {
  const onFinish = (values:any) => {
    // Call a function to create a new workspace
    onCreateWorkspace(values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item label="Workspace Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Workspace
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateWorkspaceForm;
