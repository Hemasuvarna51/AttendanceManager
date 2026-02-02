import { useState } from "react";
import styled from "styled-components";

/* ===== styled components ===== */

const Container = styled.div`
  max-width: 600px;
  margin: 30px auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 5px;
`;

const SubTitle = styled.h3`
  margin-top: 20px;
`;

const Divider = styled.hr`
  margin: 10px 0 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) =>
    props.cancel ? "#6c757d" : "#0d6efd"};
  color: #fff;

  &:hover {
    opacity: 0.9;
  }
`;

/* ===== component ===== */

export default function RequestLeave() {
  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    fromDate: "",
    toDate: "",
    reason: "",
    leaveType: "Casual Leave",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leave Request Submitted:", formData);
    alert("Leave request submitted successfully!");

    setFormData({
      empId: "",
      empName: "",
      fromDate: "",
      toDate: "",
      reason: "",
      leaveType: "Casual Leave",
    });
  };

  return (
    <Container>
      <Title>Leave Management System</Title>
      <Divider />

      <SubTitle>Request A Leave</SubTitle>

      <Form onSubmit={handleSubmit}>
        <Label>Emp ID:</Label>
        <Input
          type="text"
          name="empId"
          value={formData.empId}
          onChange={handleChange}
          required
        />

        <Label>Emp Name:</Label>
        <Input
          type="text"
          name="empName"
          value={formData.empName}
          onChange={handleChange}
          required
        />

        <Label>From Date:</Label>
        <Input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
        />

        <Label>To Date:</Label>
        <Input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          required
        />

        <Label>Reason For Leave:</Label>
        <TextArea
          name="reason"
          rows="3"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <Label>Leave Type:</Label>
        <Select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
        >
          <option>Casual Leave</option>
          <option>Sick Leave</option>
          <option>Earned Leave</option>
        </Select>

        <ButtonGroup>
          <Button type="submit">Submit</Button>
          <Button type="reset" cancel>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

