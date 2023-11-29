// classrooms/[id].tsx
"use client";
import React, { useEffect, useState } from "react";
import ClassHandler from "@/lib/handler/api/classHandler";
import { useParams } from "next/navigation";
import { LoadingOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import {
  Spin,
  Breadcrumb,
  Badge,
  Descriptions,
  Button,
  Select,
  Divider,
  Typography,
  Row,
  Col,
  FloatButton,
} from "antd";
import type { DescriptionsProps, SelectProps } from "antd";
import feedHandler from "@/lib/handler/api/feedHandler";
import InClassPostCreationCard from "@/lib/components/inClassPostCreationCard";
import ClassFeedCard from "@/lib/components/ClassFeedClass";
const { Text } = Typography;

const ClassroomPage = () => {
  const params = useParams();
  const [classroom, setClassroom] = useState<any>(null); //classData
  const [classFeed, setClassFeeds] = useState<any>([]); //classfeed
  const [options, setOptions] = useState<SelectProps["options"]>([]); //prop option select feed
  const [selectedFeed, setSelectedFeed] = useState(""); //selectedfeed
  const [postModalVisible, setPostModalVisible] = useState(false); //modal
  const [classpostData, setClassPostData] = useState<FormData | null>(null);
  const [feedDetailed, setFeedDetailed] = useState<any>(); //get feedDetails

  console.log("Params:", params);
  console.log("Classroom:", classroom);
  console.log("Class Feeds:", classFeed);
  console.log("Options:", options);
  console.log("Selected Feed:", selectedFeed);
  console.log("Post Modal Visible:", postModalVisible);
  console.log("Class Post Data:", classpostData);
  console.log("Feed Detailed:", feedDetailed);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classroom details
        const classroomDetails = await ClassHandler.getClassroomDetails(
          params.pid.toString()
        );
        setClassroom(classroomDetails);
        console.log("Classroom Details:", classroomDetails);

        // Fetch classroom feeds
        const classroomFeeds = await feedHandler.getClassroomFeeds(
          classroomDetails?.id
        );
        const updatedOptions = classroomFeeds.map((feed: any) => ({
          label: feed.name,
          value: feed.name,
        }));
        setOptions(updatedOptions);
        setFeedDetailed(classroomFeeds);
        console.log("Classroom Feeds:", classroomFeeds);

        // Fetch feed posts
        if (classroomDetails?.id && classroomFeeds.length > 0) {
          const response = await feedHandler.getFeedPosts(
            classroomDetails.id,
            classroomFeeds[0]?.id
          );
          const sortedFeed = response.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

          setClassFeeds(sortedFeed || []);

          console.log("Feed Posts:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (params.pid) {
      fetchData();
      setSelectedFeed(classroom?.name + classroom?.id);
    }
  }, [params.pid, classroom?.id, classroom?.name, classpostData]);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Class name",
      children: classroom?.name,
    },
    {
      key: "2",
      label: "invite code",
      children: classroom?.invite_code,
    },
    {
      key: "3",
      label: "credit",
      children: "3",
    },
    {
      key: "4",
      label: "Class ID",
      children: classroom?.id,
    },
    {
      key: "5",
      label: "owner",
      children: classroom?.user_id,
      span: 3,
    },
    {
      key: "6",
      label: "Status",
      children: <Badge status="processing" text="Running" />,
    },
  ];

  const handleCreatePost = async (postData: any) => {
    console.log("classroomDetails:", classFeed);
    try {
      await feedHandler.createFeedPost(
        classroom.id,
        feedDetailed[0]?.id,
        postData
      );
      // Set the postData state to trigger the useEffect
      setClassPostData(postData);
      console.log("contentInFeed Page:", classpostData);

      setPostModalVisible(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          {
            href: "/",
            title: <HomeOutlined />,
          },
          {
            title: (
              <>
                <UserOutlined />
                <span>classroom</span>
              </>
            ),
          },
          {
            title: classroom?.name,
          },
        ]}
      />
      {classroom ? (
        <div>
          <FloatButton
            onClick={() => setPostModalVisible(true)}
            tooltip={<div>createPost</div>}
          />

          {postModalVisible && (
            <InClassPostCreationCard
              onCreatePost={handleCreatePost}
              onCancel={() => setPostModalVisible(false)}
            />
          )}
          <h1>{classroom.name}</h1>
          {/* Render other details of the classroom */}
          <Descriptions
            title="classroomDetails"
            bordered
            items={items}
            extra={<Button type="primary">Edit</Button>}
          />
          <Divider orientation="left">Feeds </Divider>
          <Row gutter={[16, 16]}>
            {classFeed.map((feedItem: any, index: any) => (
              <Col key={index} span={24}>
                <ClassFeedCard feedItem={feedItem} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 79 }} spin />} />
      )}
    </div>
  );
};

export default ClassroomPage;
