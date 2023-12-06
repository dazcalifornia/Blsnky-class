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
  Form,
  Input,
} from "antd";
import type { DescriptionsProps } from "antd";
const { TabPane } = Tabs;
const { TextArea } = Input;

import moment from "moment";

import feedHandler from "@/lib/handler/api/feedHandler";
import InClassPostCreationCard from "@/lib/components/inClassPostCreationCard";
import CreateAssignmentModal from "@/lib/components/CreateAssignmentModal";
import ClassFeedCard from "@/lib/components/ClassFeedClass";
import UserHandler from "@/lib/handler/api/userHandler";
import AssignmentHandler from "@/lib/handler/api/assignMentHandler";
import AssignmentSubmissionForm from "@/lib/components/AssignmentSubmissionForm";
import Workspace from "@/lib/components/Workspace";
import CreateWorkspaceButton from "@/lib/components/CreateWorkspaceButton";

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
  const [assignmentDetailsVisible, setAssignmentDetailsVisible] =
    useState(false);

  const [toDoListItems, setToDoListItems] = useState<any[]>([]);
  const [submittedList, setSubmittedList] = useState<any[]>([]);
  const [reviewedAssignments, setReviewedAssignments] = useState<any[]>([]);

  const [reviewResult, setReviewResult] = useState<any>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    //fetch userRole
    const getRole = async () => {
      const res = await UserHandler.getUserRole();
      setUserRole(res.role);
    };

    const fetchAssignments = async () => {
      try {
        const assignmentsResponse = await AssignmentHandler.listAssignments(
          classroom?.id
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

  const showAssignmentDrawer = async (assignment: any) => {
    console.log("ASsignment Sleceted:", assignment);
    setSelectedAssignment(assignment);
    setAssignmentDrawerVisible(true);
  };

  const showAssignmentDetails = (submitted: any) => {
    console.log("subbmit:", submitted);
    setSelectedAssignment(submitted);

    setAssignmentDetailsVisible(true);
  };

  const closeAssignmentDrawer = () => {
    setAssignmentDrawerVisible(false);
  };

  const closeAssignmentDetails = () => {
    setAssignmentDetailsVisible(false);
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
        const res = await AssignmentHandler.fetchSubmissions(classroom?.id);

        // Filter submissions with a status of "Scored"
        const scoredSubmissions = res.filter(
          (submission: { status: string }) => submission.status === "Scored"
        );

        // Set the reviewed assignments state
        setReviewedAssignments(scoredSubmissions);

        // Set the main submitted list state (excluding scored submissions)
        setSubmittedList(
          res.filter(
            (submission: { status: string }) => submission.status !== "Scored"
          )
        );

        console.log("fetchSubmissions:", res);
      } catch (error) {
        console.log("Error while fetch Submitted assignments:", error);
        throw error;
      }
    };
    const fetchSubmittedUser = async (selectedAssignment: any) => {
      console.log("consoqqqq:", selectedAssignment);
      try {
        const res = await AssignmentHandler.fetchSubmissionsUser(
          classroom?.id,
          selectedAssignment?.id
        );
        setSubmittedList(res);
        console.log("fetchSubmissions:", res[0]);
      } catch (error) {
        console.log("Error while fetch Submitted assignments:", error);
        throw error;
      }
    };
    const getAssignmentScoresAndFeedback = async (assignment: any) => {
      console.log("recieveProp:", assignment, classroom);
      try {
        const res = await AssignmentHandler.getAssignmentScoresAndFeedback(
          classroom.id,
          assignment.id
        );
        setReviewResult(res);
        console.log("scores and feedback", res);
        return res;
      } catch (err) {
        console.log("errrrr", err);
        throw err;
      }
    };

    if (userRole === "teacher") {
      fetchSubmitted();
    } else {
      if (selectedAssignment) {
        getAssignmentScoresAndFeedback(selectedAssignment);
        fetchSubmittedUser(selectedAssignment);
      }
    }
  }, [
    classroom,
    classroom?.id,
    selectedAssignment,
    selectedAssignment?.id,
    userRole,
  ]);

  const onFinish = async (values: any) => {
    try {
      if (selectedAssignment) {
        // Call the scoreAssignment hook to submit the score and feedback
        await AssignmentHandler.scoreAssignment(
          classroom.id,
          selectedAssignment.id,
          values.score,
          values.feedback
        );

        closeAssignmentDrawer();
      }
    } catch (error) {
      console.error("Error scoring assignment:", error);
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
            title="Classroom details"
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
                    actions={
                      isTeacher
                        ? undefined // If the user is a teacher, don't show any actions
                        : [
                            <a
                              onClick={() => showAssignmentDrawer(assignment)}
                              key={`a-${assignment.id}`}
                            >
                              View Details
                            </a>,
                          ]
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                      }
                      title={
                        <div>
                          {assignment.title}
                          {assignment.isSubmitted && (
                            <Badge status="success" text="Submitted" />
                          )}
                        </div>
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
              <>
                <TabPane tab="Assignments Review" key="3">
                  <Divider orientation="left">Assignment Review</Divider>
                  {/* Assignments content as a list */}
                  <List
                    dataSource={submittedList}
                    bordered
                    renderItem={(submission: any) => (
                      <List.Item
                        key={submission.id}
                        actions={[
                          <a
                            onClick={() => showAssignmentDrawer(submission)}
                            key={`a-${submission.id}`}
                          >
                            View Details
                          </a>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                          }
                          title={<>{submission.user_id}</>}
                          description={`Due Date: ${moment(
                            submission.submission_time
                          ).format("MMMM Do YYYY, h:mm:ss a")}`}
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
                <TabPane tab="Reviewed Assignments" key="4">
                  <Divider orientation="left">Reviewed Assignments</Divider>
                  {/* Assignments content as a list */}
                  <List
                    dataSource={reviewedAssignments}
                    bordered
                    renderItem={(submission: any) => (
                      <List.Item
                        key={submission.id}
                        actions={[
                          <a
                            onClick={() => showAssignmentDetails(submission)}
                            key={`a-${submission.id}`}
                          >
                            View Details
                          </a>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                          }
                          title={<>{submission.user_id}</>}
                          description={`Submit Date: ${moment(
                            submission.submission_time
                          ).format("MMMM Do YYYY, h:mm:ss a")}`}
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
              </>
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
            <TabPane tab="workspace" key="5">
              <Divider orientation="left">Workspace</Divider>
              <Workspace classDetails={classroom} />
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
              <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                <h2>{selectedAssignment?.name}</h2>
                <p>
                  Due date:{" "}
                  {moment(selectedAssignment?.dueDate).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </p>
              </div>
              {selectedAssignment && (
                <>
                  {/* Add more assignment review details as needed */}
                  <Form form={form} onFinish={onFinish}>
                    <Form.Item
                      label="Score"
                      name="score"
                      rules={[
                        { required: true, message: "Please enter the score" },
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Feedback" name="feedback">
                      <TextArea />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit Review
                      </Button>
                    </Form.Item>
                  </Form>
                </>
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
                  <p>
                    Due Date:{" "}
                    {moment(selectedAssignment?.scheduled_submission).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                  <p>Score: {selectedAssignment.max_score}</p>
                  {reviewResult && (
                    <>
                      <Divider>Score & Feedback</Divider>
                      <p>Yourscore: {reviewResult[0]?.score}</p>
                      <p>Yourfeedback: {reviewResult[0]?.feedback}</p>
                    </>
                  )}

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
                                <div>
                                  <p>Files List:</p>
                                  <ul>
                                    {submission.file_paths.map(
                                      (filePath: string, index: number) => (
                                        <li key={index}>{filePath}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
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
          {isTeacher && (
            // Teacher view
            <Drawer
              title="Assignment Review"
              placement="right"
              closable={true}
              onClose={closeAssignmentDetails}
              visible={assignmentDetailsVisible}
              width={400} // Adjust the width as needed
            >
              {selectedAssignment && (
                <>{/* Add more assignment review details as needed */}</>
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
