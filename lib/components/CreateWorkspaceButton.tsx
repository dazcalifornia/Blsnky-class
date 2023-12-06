import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import CreateWorkspaceForm from './CreateWorkspaceForm';
import WorkspaceHandler from '@/lib/handler/api/WorkspaceHandler'; // Update the path

const CreateWorkspaceButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateWorkspace = async (values:any) => {
    try {
      // Call the createWorkspace method from WorkspaceHandler
      await WorkspaceHandler.createWorkspace(values.name, values.description);

      // Close the modal after successful creation
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating workspace:', error);
      // Handle error appropriately (e.g., show error message)
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Create Workspace
      </Button>
      <Modal
        title="Create Workspace"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <CreateWorkspaceForm onCreateWorkspace={handleCreateWorkspace} />
      </Modal>
    </>
  );
};

export default CreateWorkspaceButton;
