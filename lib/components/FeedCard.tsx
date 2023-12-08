// components/FeedCard.tsx
import React from "react";
import { Card, Typography, Space, Image } from "antd";

const { Title, Text } = Typography;

interface FeedCardProps {
  feedItem: {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: string;
    files: string[];
    images: string[];
  };
}
//const API_BASE_URL = "http://localhost:4049";
const API_BASE_URL = "http://server.franx.dev";

const FeedCard: React.FC<FeedCardProps> = ({ feedItem }) => {
  return (
    <Card style={{ width: "100%" }}>
      <Title level={4}>{feedItem.title}</Title>
      <Text type="secondary">Posted by User ID: {feedItem.user_id}</Text>
      <p>{feedItem.content}</p>
      <Space direction="vertical">
        {feedItem.images.map((image, index) => (
          <Image
            key={index}
            src={`${API_BASE_URL}/uploads/posts/${feedItem.user_id}/${image}`}
            alt={`Image ${index + 1}`}
          />
        ))}
        {feedItem.files.map((file, index) => (
          <a
            key={index}
            href={`${API_BASE_URL}/uploads/posts/${feedItem.user_id}/${file}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download File {index + 1}
          </a>
        ))}
      </Space>
    </Card>
  );
};

export default FeedCard;
