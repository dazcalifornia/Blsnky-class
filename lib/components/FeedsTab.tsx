// FeedsTab.tsx
import React from 'react';
import { Divider, Row, Col,Tabs} from 'antd';
import ClassFeedCard from '@/lib/components/ClassFeedClass';

const {TabPane} = Tabs

const FeedsTab = ({ classFeed, feedDetailed, handleCreatePost }:any) => (
  <TabPane tab="Feeds" key="1">
    <Divider orientation="left">Feeds </Divider>
    <Row gutter={[16, 16]}>
      {classFeed.map((feedItem: any, index: any) => (
        <Col key={index} span={24}>
          <ClassFeedCard feedItem={feedItem} />
        </Col>
      ))}
    </Row>
  </TabPane>
);

export default FeedsTab;
