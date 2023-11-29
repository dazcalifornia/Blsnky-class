// components/PostCreationCard.tsx
import React, { useState } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface PostCreationCardProps {
  onCreatePost: (postData: FormData) => void;
  onCancel: () => void;
}

const PostCreationCard: React.FC<PostCreationCardProps> = ({
  onCreatePost,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      // No need to get a pre-signed URL, directly append the file to FormData
      const newFile = { uid: file.uid, name: file.name, originFileObj: file };
      setFileList((prevList) => [...prevList, newFile]);
      onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      onError(error);
    }
  };

  const onFinish = async (values: any) => {
    const postData = new FormData();
    postData.append("title", values.title);
    postData.append("content", values.content);
    fileList.forEach((file) => {
      postData.append("files", file.originFileObj);
    });

    console.log("mainfed:", postData);

    onCreatePost(postData);
    form.resetFields(); // Clear the form fields
    setFileList([]); // Clear the file list
    onCancel(); // Close the modal after creating a post
  };

  return (
    <Modal
      title="Create Post"
      visible={true}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit}>
          Create Post
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Content">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="files"
          label="Files"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload
            customRequest={customRequest}
            listType="picture"
            maxCount={5}
            accept="image/*,audio/*,video/*"
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostCreationCard;
