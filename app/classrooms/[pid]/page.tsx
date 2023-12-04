// classrooms/[id].tsx
"use client";
import React, { useEffect, useState } from "react";
import ClassHandler from "@/lib/handler/api/classHandler";
import { useParams } from "next/navigation";
import {
  LoadingOutlined,
  HomeOutlined,
  UserOutlined,
  CommentOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Spin,
  Breadcrumb,
  Badge,
  Descriptions,
  Button,
  Divider,
  Row,
  Col,
  FloatButton,
  Tabs,
  Drawer,
  List,
  Avatar,
} from "antd";
import type { DescriptionsProps } from "antd";
const { TabPane } = Tabs;

import moment from "moment";

import feedHandler from "@/lib/handler/api/feedHandler";
import InClassPostCreationCard from "@/lib/components/inClassPostCreationCard";
import CreateAssignmentModal from "@/lib/components/CreateAssignmentModal";
import ClassFeedCard from "@/lib/components/ClassFeedClass";
import UserHandler from "@/lib/handler/api/userHandler";
import AssignmentHandler from "@/lib/handler/api/assignMentHandler";
import AssignmentSubmissionForm from "@/lib/components/AssignmentSubmissionForm";

const ClassroomPage = () => {
  const params = useParams();
  const [classroom, setClassroom] = useState<any>(null); //classData
  const [classFeed, setClassFeeds] = useState<any>([]); //classfeed
  const [postModalVisible, setPostModalVisible] = useState(false); //modal
  const [classpostData, setClassPostData] = useState<FormData | null>(null);
  const [feedDetailed, setFeedDetailed] = useState<any>(); //get feedDetails
  const [createAssignmentModalVisible, setCreateAssignmentModalVisible] =
    useState(false);
  const [userRole, setUserRole] = useState("");

  const [activeTab, setActiveTab] = useState("1"); // Default tab key
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(
    null
  );
  const [assignmentDrawerVisible, setAssignmentDrawerVisible] = useState(false);

  const [toDoListItems, setToDoListItems] = useState<any[]>([]);
  const [submittedList, setSubmittedList] = useState<any>();

  useEffect(() => {
    //fetch userRole
    const getRole = async () => {
      const res = await UserHandler.getUserRole();
      setUserRole(res.role);
    };

    const fetchAssignments = async () => {
      try {
        const assignmentsResponse = await AssignmentHandler.listAssignments(
          classroom.id
        );

        // Fetch submissions for each assignment
        const submittedAssignmentsPromises = assignmentsResponse.map(
          async (assignment: any) => {
            const submissions =
              await AssignmentHandler.listSubmittedAssignmentEachClass(
                assignment.id
              );

            const isSubmitted = submissions.submissions.length > 0;

            return {
              ...assignment,
              isSubmitted: isSubmitted,
            };
          }
        );

        // Wait for all promises to resolve
        const updatedAssignments = await Promise.all(
          submittedAssignmentsPromises
        );

        setAssignments(updatedAssignments);

        // Update the to-do list items
        const toDoList = updatedAssignments
          .filter((assignment) => !assignment.isSubmitted)
          .map((assignment) => ({
            key: assignment.id,
            title: assignment.title,
            description: `Due Date: ${moment(
              assignment.scheduled_submission
            ).format("MMMM Do YYYY, h:mm:ss a")}`,
          }));

        setToDoListItems(toDoList);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();

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
        // const updatedOptions = classroomFeeds.map((feed: any) => ({
        //   label: feed.name,
        //   value: feed.name,
        // }));
        // setOptions(updatedOptions);
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
      getRole();
      //setSelectedFeed(classroom?.name + classroom?.id);
    }
  }, [params.pid, classroom?.id, classroom?.name, classpostData, activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const isTeacher = userRole === "teacher";

  const handleCreateAssignment = () => {
    // Logic to refresh assignment list or any other action after creating an assignment
    // Example: refetch assignments
  };

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
      label: "Class ID",
      children: classroom?.id,
    },
    {
      key: "4",
      label: "owner",
      children: classroom?.user_id,
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

  const createAssignmentButton = (
    <FloatButton.Group
      trigger="click"
      type="primary"
      style={{ right: 24 }}
      icon={<MenuOutlined />}
    >
      <FloatButton
        onClick={() => setCreateAssignmentModalVisible(true)}
        tooltip={<div>Create assignment</div>}
      />
      <FloatButton
        icon={<CommentOutlined />}
        onClick={() => setPostModalVisible(true)}
        tooltip={<div>createPost</div>}
      />
    </FloatButton.Group>
  );

  const createAssignmentButtonHover = (
    <FloatButton.Group
      trigger="hover"
      type="primary"
      style={{ right: 94 }}
      icon={<MenuOutlined />}
    >
      <FloatButton
        icon={<CommentOutlined />}
        onClick={() => setPostModalVisible(true)}
        tooltip={<div>createPost</div>}
      />
    </FloatButton.Group>
  );

  const showAssignmentDrawer = (assignment: any) => {
    setSelectedAssignment(assignment);
    setAssignmentDrawerVisible(true);
  };

  const closeAssignmentDrawer = () => {
    setAssignmentDrawerVisible(false);
  };

  const submitAssignment = async (assignmentFiles: FormData) => {
    try {
      // Use your existing submitAssignment function here
      const response = await AssignmentHandler.submitAssignment(
        classroom.id,
        selectedAssignment.id,
        assignmentFiles
      );

      console.log("Assignments submitted successfully. Response:", response);

      return response; // Return the response if needed
    } catch (error) {
      console.error("Error submitting assignments:", error);
      throw error; // Propagate the error to handle it in the form component
    }
  };

  useEffect(() => {
    const fetchSubmitted = async () => {
      try {
        const res = await AssignmentHandler.fetchSubmissions(
          classroom?.id,
          selectedAssignment?.id
        );
        setSubmittedList(res);
        console.log("fetchSubmissions:", res);
      } catch (error) {
        console.log("Error while fetch Submitted assignments:", error);
        throw error;
      }
    };

    fetchSubmitted();
  }, [classroom?.id, selectedAssignment?.id]);

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
          {isTeacher && createAssignmentButton}
          {userRole === "user" && createAssignmentButtonHover}
          {postModalVisible && (
            <InClassPostCreationCard
              onCreatePost={handleCreatePost}
              onCancel={() => setPostModalVisible(false)}
            />
          )}
          <CreateAssignmentModal
            visible={createAssignmentModalVisible}
            onCancel={() => setCreateAssignmentModalVisible(false)}
            onCreateAssignment={handleCreateAssignment}
            classroomId={classroom.id}
          />
          <h1>{classroom.name}</h1>
          {/* Render other details of the classroom */}
          <Descriptions
            title="ClassroomDetails"
            bordered
            items={items}
            extra={<Button type="primary">Edit</Button>}
          />
          <Divider />

          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Feeds" key="1">
              <Divider orientation="left">Feeds </Divider>

              {/* Your current feeds content */}
              <Row gutter={[16, 16]}>
                {classFeed.map((feedItem: any, index: any) => (
                  <Col key={index} span={24}>
                    <ClassFeedCard feedItem={feedItem} />
                  </Col>
                ))}
              </Row>
            </TabPane>
            <TabPane tab="Assignments" key="2">
              <Divider orientation="left">Assignment</Divider>
              {/* Assignments content as a list */}
              <List
                dataSource={assignments}
                bordered
                renderItem={(assignment: any) => (
                  <List.Item
                    key={assignment.id}
                    actions={[
                      <a
                        onClick={() => showAssignmentDrawer(assignment)}
                        key={`a-${assignment.id}`}
                      >
                        View Details
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                      }
                      title={
                        <>
                          {assignment.title}
                          {assignment.isSubmitted && (
                            <Badge status="success" text="Submitted" />
                          )}
                        </>
                      }
                      description={`Due Date: ${moment(
                        assignment.scheduled_submission
                      ).format("MMMM Do YYYY, h:mm:ss a")}`}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            {isTeacher ? (
              <TabPane tab="Assignments Review" key="3">
                <Divider orientation="left">Assignment Review</Divider>
                {/* Assignments content as a list */}
                <List
                  dataSource={submittedList}
                  bordered
                  renderItem={(submittedList: any) => (
                    <List.Item
                      key={submittedList.id}
                      actions={[
                        <a
                          onClick={() => showAssignmentDrawer(submittedList)}
                          key={`a-${submittedList.id}`}
                        >
                          View Details
                        </a>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                        }
                        title={<>{submittedList.user_id}</>}
                        description={`Due Date: ${moment(
                          submittedList.scheduled_time
                        ).format("MMMM Do YYYY, h:mm:ss a")}`}
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            ) : (
              <TabPane tab="To-do List" key="3">
                <Divider orientation="left">To do</Divider>
                {/* Assignments if not submmit */}
                <List
                  dataSource={toDoListItems}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            )}
            <TabPane tab="workspace" key="4">
              <Divider orientation="left">Workspace</Divider>
            </TabPane>
          </Tabs>
          {/* Assignment Drawer */}
          {isTeacher ? (
            // Teacher view
            <Drawer
              title="Assignment Review"
              placement="right"
              closable={true}
              onClose={closeAssignmentDrawer}
              visible={assignmentDrawerVisible}
              width={400} // Adjust the width as needed
            >
              {selectedAssignment && (
                <>{/* Add more assignment review details as needed */}</>
              )}
            </Drawer>
          ) : (
            // Student view
            <Drawer
              title="Assignment Details"
              placement="right"
              closable={true}
              onClose={closeAssignmentDrawer}
              visible={assignmentDrawerVisible}
              width={400} // Adjust the width as needed
            >
              {selectedAssignment && (
                <>
                  <p>Title: {selectedAssignment.title}</p>
                  <p>Description: {selectedAssignment.description}</p>

                  {/* New section for submitted files */}
                  {selectedAssignment.isSubmitted ? (
                    <>
                      <Divider orientation="left">Submitted Files</Divider>

                      <List
                        dataSource={submittedList}
                        renderItem={(submission: any) => (
                          <List.Item>
                            <List.Item.Meta
                              title={`Submission Time: ${moment(
                                submission.submission_time
                              ).format("MMMM Do YYYY, h:mm:ss a")}`}
                              description={
                                <ul>
                                  {submission.file_paths.map(
                                    (filePath: string, index: number) => (
                                      <li key={index}>{filePath}</li>
                                    )
                                  )}
                                </ul>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <p>No files submitted yet.</p>
                      <AssignmentSubmissionForm onSubmit={submitAssignment} />
                    </>
                  )}
                </>
              )}
            </Drawer>
          )}
        </div>
      ) : (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 79 }} spin />} />
      )}
    </div>
  );
};

export default ClassroomPage;
