import React, { useState } from "react";
import { Modal, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface InClassPostCreationCardProps {
  onCreatePost: (postData: FormData) => void;
  onCancel: () => void;
}

const InClassPostCreationCard: React.FC<InClassPostCreationCardProps> = ({
  onCreatePost,
  onCancel,
}) => {
  const [content, setContent] = useState<string>("");

  const onFinish = async () => {
    console.log("postData:", content); // Log the postData object

    onCreatePost(content);

    setContent(""); // Clear the content state
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
        <Button key="submit" type="primary" onClick={onFinish}>
          Create Post
        </Button>,
      ]}
    >
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter post content"
      />
    </Modal>
  );
};

export default InClassPostCreationCard;
