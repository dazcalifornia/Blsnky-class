import {useState,useEffect} from "react"

import UserHandler from "@/lib/handler/api/userHandler";
import AssignmentHandler from "@/lib/handler/api/assignMentHandler";
import AssignmentSubmissionForm from "@/lib/components/AssignmentSubmissionForm";

import { List ,Avatar} from "antd";
import moment from "moment";

const AssignmentReviews = ({classroom, selectedAssignment}:any) => {

    const [submittedList, setSubmittedList] = useState<any[]>([]);
  useEffect(() => {
    const fetchSubmitted = async () => {
      try {
        const res = await AssignmentHandler.fetchSubmissions(classroom?.id);
        setSubmittedList(res);
        console.log("fetchSubmissions:", res);
      } catch (error) {
        console.log("Error while fetch Submitted assignments:", error);
        throw error;
      }
    };

    fetchSubmitted();
  }, [classroom?.id, selectedAssignment?.id]);
  function showAssignmentDetails(submittedList: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <List
    dataSource={submittedList}
    bordered
    renderItem={(submittedList: any) => (
      <List.Item
        key={submittedList.id}
        actions={[
          <a
            onClick={() => showAssignmentDetails(submittedList)}
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
  );
};

export default AssignmentReviews;
