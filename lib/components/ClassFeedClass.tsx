// components/ClassFeedCard.tsx
import React from "react";
import { Card, Typography, Space, Image } from "antd";

const { Title, Text } = Typography;

interface FeedCardProps {
  feedItem: {
    id: number;
    feed_id: number;
    content: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

const ClassFeedCard: React.FC<FeedCardProps> = ({ feedItem }) => {
  return (
    <Card style={{ width: "100%" }}>
      <Text type="secondary">Posted by User ID: {feedItem.user_id}</Text>
      <p>{feedItem.content}</p>
    </Card>
  );
};

export default ClassFeedCard;
