// ClassroomDetails.tsx
import React from 'react';
import { Descriptions, Button, Divider,Badge } from 'antd';
import type { DescriptionsProps } from 'antd';

const ClassroomDetails = ({ classroom }:any ) => {
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
    

  return (
    <Descriptions
      title="ClassroomDetails"
      bordered
      items={items}
      extra={<Button type="primary">Edit</Button>}
    />
  );
};

export default ClassroomDetails;
