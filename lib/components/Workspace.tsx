import React, { useState, useEffect } from "react";
import { Tabs, List, Button, Modal, Spin, Alert } from "antd";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import InviteMembersForm from "./InviteMembersForm";
import WorkspaceHandler from "@/lib/handler/api/WorkspaceHandler";

const { TabPane } = Tabs;

const Workspace = (classDetails: any) => {
  console.log("classes Passprop:", classDetails);

  let classID = classDetails.classDetails?.id;

  const [workspaces, setWorkspaces] = useState<any>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const fetchedWorkspaces = await WorkspaceHandler.getWorkspaces(classID);
        console.log("fetchedWorkspaces:", fetchedWorkspaces);
        setWorkspaces(fetchedWorkspaces);
        setError(null);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        setError("Error fetching workspaces. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [classID]);

  const handleCreateWorkspace = async (workspaceData: any) => {
    console.log("classId:", classID);
    setLoading(true);
    try {
      await WorkspaceHandler.createWorkspace(
        workspaceData.name,
        workspaceData.description,
        classID
      );

      const fetchedWorkspaces = await WorkspaceHandler.getWorkspaces(classID);
      setWorkspaces(fetchedWorkspaces);
      setError(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error creating workspace:", error);
      setError("Error creating workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMembers = (inviteData: any) => {
    console.log("Inviting members:", inviteData);
  };

  return (
    <div>
      <Tabs onChange={(key) => setActiveWorkspace(key)}>
        <TabPane
          tab="Create Workspace"
          key="create"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Create Workspace
          </Button>
        </TabPane>
        <TabPane tab="Workspaces" key="workspaces">
          {loading && <Spin />}
          {error && <Alert message={error} type="error" />}
          {!loading && !error && (
            <List
              dataSource={workspaces}
              renderItem={(workspaces: any) => (
                <List.Item>
                  <List.Item.Meta title={workspaces.name} />
                </List.Item>
              )}
            />
          )}
        </TabPane>
        {activeWorkspace && (
          <TabPane tab={`Invite Members to ${activeWorkspace}`} key="invite">
            <InviteMembersForm onInviteMembers={handleInviteMembers} />
          </TabPane>
        )}
      </Tabs>

      {/* Create Workspace Modal */}
      <Modal
        title="Create Workspace"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <CreateWorkspaceForm onCreateWorkspace={handleCreateWorkspace} />
      </Modal>
    </div>
  );
};

export default Workspace;
