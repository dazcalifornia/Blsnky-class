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
  Comment,
  List,
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
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const API_BASE_URL = "http://localhost:4049";

const WorkspacePage = () => {
  const params = useParams();
  const [classroom, setClassroom] = useState<any>(null);
  const [workSpace, setWorkSpace] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [attachmentFileList, setAttachmentFileList] = useState<any[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroomDetails = await ClassHandler.getClassroomDetails(
          params.class.toString()
        );
        setClassroom(classroomDetails);

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

  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const postsData = await WorkspaceHandler.getPosts(workSpace.id);
        setPosts(postsData);

        if (postsData.length > 0) {
          const commentsPromises = postsData.map(async (post: any) => {
            const commentsData = await WorkspaceHandler.getComments(post.id);
            return commentsData;
          });

          const allComments = await Promise.all(commentsPromises);
          setComments(allComments.flat());
        }
      } catch (error) {
        console.error("Error fetching posts and comments:", error);
      }
    };

    if (workSpace) {
      fetchPostsAndComments();
    }
  }, [workSpace]);

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
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
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("workspaceId", workSpace.id);
    formData.append("content", values.content);
    fileList.forEach((file: any) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const res = await WorkspaceHandler.createPost(formData);
      setFileList([]);
      form.resetFields();
      message.success("Post has been created");
      //setPosts((prevPosts) => [res, ...prevPosts]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Custom request for file upload
  const customAttachmentRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      // Append the file to the list
      const newFile = { uid: file.uid, name: file.name, originFileObj: file };
      setAttachmentFileList((prevList) => [...prevList, newFile]);
      onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      onError(error);
    }
  };

  // Remove file from the attachment list
  const handleAttachmentRemove = (file: any) => {
    setAttachmentFileList((prevList) =>
      prevList.filter((item) => item.uid !== file.uid)
    );
  };

  const onFinishComment = async (postId: string, values: any) => {
    const formData = new FormData();

    // Append form data
    formData.append("postId", postId);
    formData.append("content", values.content);

    // Append files
    attachmentFileList.forEach((file: any) => {
      formData.append("attachmentFiles", file.originFileObj);
    });

    try {
      // Call the createComment function with post ID, form values, and files
      const res = await WorkspaceHandler.createComment(formData);

      console.log("Comment creation response:", res);

      // After successfully creating a comment, fetch the updated list of comments
      const updatedComments = await WorkspaceHandler.getComments(postId);

      // Update the comments state to rerender the comments section
      setComments(updatedComments);

      // Reset form fields and file list
      setAttachmentFileList([]);
      form.resetFields();

      message.success("Comment has been added");
    } catch (error) {
      console.error("Error creating comment:", error);
      // Handle error appropriately, e.g., show an error message to the user
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { href: "/", title: <HomeOutlined /> },
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
                        href={`${API_BASE_URL}/uploads/workSpace/posts/${
                          post.user_id
                        }/${fileName.trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download File {fileName}
                      </a>
                    ))}
                  {/* Comment Section */}
                  <Collapse accordion>
                    <Panel header="Comments" key="1">
                      <List
                        dataSource={comments.filter(
                          (comment) => comment.post_id === post.id
                        )}
                        renderItem={(comment) => (
                          <List.Item>
                            <div>
                              <strong>User ID: {comment.user_id}</strong>
                              <p>{comment.content}</p>
                              {comment.images.map((image: any, index: any) => (
                                <Image
                                  key={index}
                                  src={`${API_BASE_URL}/uploads/workSpace/posts/comment/${comment.user_id}/${image}`}
                                  alt={`Image ${index + 1}`}
                                />
                              ))}
                              {comment.files.length > 0 &&
                                comment.files[0] !== "" &&
                                comment.files.map(
                                  (fileName: any, index: any) => (
                                    <a
                                      key={index}
                                      href={`${API_BASE_URL}/uploads/workSpace/posts/comment/${
                                        comment.user_id
                                      }/${fileName.trim()}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Download File {fileName}
                                    </a>
                                  )
                                )}
                            </div>
                          </List.Item>
                        )}
                      />

                      {/* Comment Form */}
                      <Form
                        form={form}
                        onFinish={(values) => onFinishComment(post.id, values)}
                        style={{ marginTop: "16px" }}
                      >
                        <Form.Item name="content">
                          <Input.TextArea rows={2} />
                        </Form.Item>
                        {/* Attachment Upload */}
                        <Form.Item
                          label="Attach"
                          name="attachment"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => e && e.fileList}
                        >
                          <Upload
                            customRequest={customAttachmentRequest}
                            fileList={attachmentFileList}
                            onRemove={handleAttachmentRemove}
                            listType="picture"
                            maxCount={5}
                            accept="image/*,audio/*,video/*,document/*"
                          >
                            <Button icon={<UploadOutlined />}>Attach</Button>
                          </Upload>
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Add Comment
                          </Button>
                        </Form.Item>
                      </Form>
                    </Panel>
                  </Collapse>
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
