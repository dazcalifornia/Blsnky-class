// feed/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import feedHandler from "@/lib/handler/api/feedHandler";
import { Row, Col, FloatButton, Empty } from "antd";
import FeedCard from "@/lib/components/FeedCard";
import PostCreationCard from "@/lib/components/PostCreationCard";

const FeedPage = () => {
  const [globalFeed, setGlobalFeed] = useState([]);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [postData, setPostData] = useState<FormData | null>(null);

  const fetchGlobalFeed = async () => {
    try {
      const feedData = await feedHandler.getGlobalFeed();
      // Sort the feed items by date in descending order
      const sortedFeed = feedData.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setGlobalFeed(sortedFeed || []);
    } catch (error) {
      // Handle the error
      console.error("Error fetching global feed:", error);
    }
  };

  useEffect(() => {
    // Fetch global feed
    fetchGlobalFeed();
  }, [postData]);

  const handleCreatePost = async (postData: FormData) => {
    try {
      await feedHandler.createPost(postData);
      // Set the postData state to trigger the useEffect
      setPostData(postData);
      setPostModalVisible(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <FloatButton
        onClick={() => setPostModalVisible(true)}
        tooltip={<div>createPost</div>}
      />

      {postModalVisible && (
        <PostCreationCard
          onCreatePost={handleCreatePost}
          onCancel={() => setPostModalVisible(false)}
        />
      )}

      <Row gutter={[16, 16]}>
        {globalFeed.map((feedItem, index) => (
          <Col key={index} span={24}>
            <FeedCard feedItem={feedItem} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default FeedPage;
