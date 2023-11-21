// feed/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import feedHandler from "@/lib/handler/api/feedHandler";
import { Row, Col, Button } from "antd";
import FeedCard from "@/lib/components/FeedCard";
import PostCreationCard from "@/lib/components/PostCreationCard";

const FeedPage = () => {
  const [globalFeed, setGlobalFeed] = useState([]);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [postData, setPostData] = useState<FormData | null>(null);

  const fetchGlobalFeed = async () => {
    try {
      const feedData = await feedHandler.getGlobalFeed();
      console.log("Global Feed:", globalFeed);
      // Handle the global feed data
      setGlobalFeed(feedData);
    } catch (error) {
      // Handle the error
      console.error("Error fetching global feed:", error);
    }
  };

  useEffect(() => {
    if (postData) {
      // Do something with postData (e.g., display a message)
      console.log("Received postData:", postData);
      // Reset the postData state
      setPostData(null);
    }

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
      <Button
        type="primary"
        onClick={() => setPostModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Create Post
      </Button>

      {postModalVisible && <PostCreationCard onCreatePost={handleCreatePost} />}
      <Row gutter={[16, 16]}>
        {globalFeed.map((feedItem) => (
          <Col key={feedItem.id} span={24}>
            <FeedCard feedItem={feedItem} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default FeedPage;
