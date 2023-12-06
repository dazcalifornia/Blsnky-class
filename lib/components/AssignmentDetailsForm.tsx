// AssignmentSubmissionForm.tsx

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";

const AssignmentDetailsForm = ({
  onSubmit,
}: {
  onSubmit: (score: number, feedback: string) => void;
}) => {
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = () => {
    // Validate score and feedback before submitting
    if (score < 0 || score > 100) {
      message.error("Score must be between 0 and 100.");
      return;
    }

    if (feedback.trim() === "") {
      message.error("Feedback cannot be empty.");
      return;
    }

    // Call the onSubmit function with the provided score and feedback
    onSubmit(score, feedback);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="Score"
        name="score"
        rules={[{ required: true, message: "Please enter the score." }]}
      >
        <Input
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />
      </Form.Item>
      <Form.Item
        label="Feedback"
        name="feedback"
        rules={[{ required: true, message: "Please enter feedback." }]}
      >
        <Input.TextArea
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AssignmentDetailsForm;
