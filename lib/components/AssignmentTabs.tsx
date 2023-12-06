// AssignmentsTab.tsx
import React from 'react';
import { Divider, List, Avatar, Badge,Tabs } from 'antd';
import moment from 'moment';

const {TabPane} = Tabs

const AssignmentsTab = ({ assignments, showAssignmentDrawer }:any) => (
  <TabPane tab="Assignments" key="2">
    <Divider orientation="left">Assignment</Divider>
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
            avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />}
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
            ).format('MMMM Do YYYY, h:mm:ss a')}`}
          />
        </List.Item>
      )}
    />
  </TabPane>
);

export default AssignmentsTab;
