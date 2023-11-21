// components/PostCreationCard.tsx
import React, { useState } from "react";
import {
  Card,
  Typography,
  Space,
  Button,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface PostCreationCardProps {
  onCreatePost: (postData: FormData) => void;
}

const PostCreationCard: React.FC<PostCreationCardProps> = ({
  onCreatePost,
}) => {
  const [postContent, setPostContent] = useState({
    title: "",
    content: "",
    files: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostContent({ ...postContent, [name]: value });
  };

  const handleFileChange = (info: any) => {
    setPostContent({
      ...postContent,
      files: [...postContent.files, info.file.originFileObj],
    });
    // if (info.file.status === "done") {
    //   // Update files array after successful upload
    //   setPostContent({
    //     ...postContent,
    //     files: [...postContent.files, info.file.originFileObj],
    //   });
    // } else if (info.file.status === "error") {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  };

  const handleRemoveFile = (file: File) => {
    // Remove the selected file from the files array
    const updatedFiles = postContent.files.filter((f) => f !== file);
    setPostContent({ ...postContent, files: updatedFiles });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", postContent.title);
    formData.append("content", postContent.content);
    postContent.files.forEach((file, index) => {
      formData.append("files", file);
    });

    console.log("uploaded:", postContent.files);

    // Call the parent function to handle post creation
    onCreatePost(formData);

    // Reset form after submission
    setPostContent({ title: "", content: "", files: [] });
  };

  return (
    <Card>
      <Title level={4}>Create a New Post</Title>
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input
            name="title"
            value={postContent.title}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter the content" }]}
        >
          <Input.TextArea
            name="content"
            value={postContent.content}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Files" name="files">
          <Upload
            customRequest={({ file, onSuccess, onError }) => {
              // Custom request logic goes here
              // You can use Axios or another HTTP client
              // Call onSuccess() on success and onError() on failure
            }}
            onChange={handleFileChange}
            fileList={postContent.files}
            maxCount={5}
          >
            <Button icon={<UploadOutlined />}>Upload Files</Button>
          </Upload>
        </Form.Item>
        <Space></Space>
        <Button type="primary" htmlType="submit">
          Create Post
        </Button>
      </Form>
    </Card>
  );
};

export default PostCreationCard;
