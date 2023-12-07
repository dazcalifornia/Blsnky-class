// workspace/[class]/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  Tabs,
  Input,
  Card,
  Form,
  Button,
  Collapse,
  Upload,
  message,
  Typography,
  Space,
  Image,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CommentOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import WorkspaceHandler from "@/lib/handler/api/WorkspaceHandler";
import ClassHandler from "@/lib/handler/api/classHandler";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Title, Text } = Typography;

const API_BASE_URL = "http://localhost:4049";

const WorkspacePage = () => {
  const params = useParams();
  const [classroom, setClassroom] = useState<any>(null);
  const [workSpace, setWorkSpace] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classroom details
        const classroomDetails = await ClassHandler.getClassroomDetails(
          params.class.toString()
        );
        setClassroom(classroomDetails);

        // Fetch workspace details
        const workspaceDetails = await WorkspaceHandler.getWorkspaceDetails(
          params.id
        );
        setWorkSpace(workspaceDetails[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (params.class) {
      fetchData();
    }
  }, []);

  const [comments, setComments] = useState([]);

  // Fetch posts and comments when component mounts

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const postsData = await WorkspaceHandler.getPosts(workSpace.id);
        setPosts(postsData);
        console.log(postsData);

        if (postsData.length > 0) {
          // Assuming you want to fetch comments for the first post
          const commentsData = await WorkspaceHandler.getComments(
            postsData[0].id
          );

          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching posts and comments:", error);
      }
    };

    if (workSpace) {
      fetchPostsAndComments();
    }
  }, [workSpace]);

  // Handle file upload
  const customRequest = async ({ file, onSuccess, onError }: any) => {
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

  const onChange = (info: any) => {
    setFileList(info.fileList);
  };

  const handleUploadRemove = (file: any) => {
    // Handle file removal
    console.log("Removing file:", file);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();

    // Append form data
    formData.append("workspaceId", workSpace.id);
    formData.append("content", values.content);

    // Append files
    fileList.forEach((file: any) => {
      formData.append("files", file.originFileObj);
      console.log("beepp:", file);
    });

    try {
      // Call the createPost function with workspace ID, form values, and files
      const res = await WorkspaceHandler.createPost(formData).finally(() => {
        setFileList([]);
        form.resetFields();
        return message.success("post has been created");
      });

      console.log("Post creation response:", res);
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error appropriately, e.g., show an error message to the user
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
            href: `/classrooms/${classroom?.id}`,
            title: classroom?.name,
          },
          { title: workSpace?.name },
        ]}
      />

      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        onChange={async (key) => {
          // Update the selected post when the tab is changed
          //setSelectedPost(posts.find((post) => post.id === key));
          console.log(key);
          if (key === "1") {
            const postData = await WorkspaceHandler.getPosts(workSpace.id);
            setPosts(postData);
          }
        }}
      >
        <TabPane
          tab={
            <span>
              <CommentOutlined /> Posts
            </span>
          }
          key="1"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {posts.map((post) => (
              <Card key={post.id} style={{ width: "100%" }}>
                <Title level={4}>{post.title}</Title>
                <Text type="secondary">Posted by User ID: {post.user_id}</Text>
                <p>{post.content}</p>
                <Space direction="vertical">
                  {post.images.map((image: any, index: any) => (
                    <Image
                      key={index}
                      src={`${API_BASE_URL}/uploads/workSpace/posts/${post.user_id}/${image}`}
                      alt={`Image ${index + 1}`}
                    />
                  ))}

                  {post.files.length > 0 &&
                    post.files[0] !== "" &&
                    post.files.map((fileName: any, index: any) => (
                      <a
                        key={index}
                        href={`${API_BASE_URL}/uploads/posts/${
                          post.user_id
                        }/${fileName.trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download File {fileName}
                      </a>
                    ))}
                </Space>
              </Card>
            ))}
          </Space>
        </TabPane>
        <TabPane
          tab={
            <span>
              <CommentOutlined /> Create Post
            </span>
          }
          key="2"
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Upload"
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={onChange}
            >
              <Upload
                customRequest={customRequest}
                fileList={fileList}
                onRemove={handleUploadRemove}
                listType="picture"
                maxCount={5}
                accept="image/*,audio/*,video/*,document/*"
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Post
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default WorkspacePage;
