// Example: InviteMembersForm.js
import React from 'react';
import { Form, Input, Button } from 'antd';

const InviteMembersForm = ({ onInviteMembers }:any) => {
  const onFinish = (values:any) => {
    // Call a function to invite members to the workspace
    onInviteMembers(values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Invite Member
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InviteMembersForm;
