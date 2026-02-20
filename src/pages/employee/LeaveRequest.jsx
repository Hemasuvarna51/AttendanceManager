import { useState } from "react";
import styled from "styled-components";
import { useLeaveStore } from "../../store/leave.store";

/* ===== styled components ===== */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const Th = styled.th`
  padding: 12px;
  background: #f3f4f6;
  text-align: left;
  font-size: 14px;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 16px;
  background: ${(props) => (props.cancel ? "#6c757d" : "#0d6efd")}; 
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: ${(props) => (props.cancel ? "#5a6268" : "#0b5ed7")};
  }
`;

const Status = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) =>
    props.status === "Approved"
      ? "#166534"
      : props.status === "Rejected"
        ? "#991b1b"
        : "#92400e"};
  background: ${(props) =>
    props.status === "Approved"
      ? "#dcfce7"
      : props.status === "Rejected"
        ? "#fee2e2"
        : "#fef3c7"};
`;

/* ===== component ===== */

export default function RequestLeave() {
  const { addLeave, leaves } = useLeaveStore();

  const [showForm, setShowForm] = useState(false);

  const initialFormData = {
    empId: "",
    empName: "",
    fromDate: "",
    toDate: "",
    reason: "",
    leaveType: "Casual Leave",
  };

  const [formData, setFormData] = useState(initialFormData );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(initialFormData);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    addLeave({
      employee: formData.empName,
      from: formData.fromDate,
      to: formData.toDate,
      type: formData.leaveType,
      reason: formData.reason,
    });

    alert("Leave request submitted successfully!");
    setShowForm(false);
    setFormData(initialFormData);
  };

  return (
    <Container>
      <Title>Leave Management System</Title>
      <Divider />

      <SubTitle>Request A Leave</SubTitle>
      <Button type = "button" onClick = {() => setShowForm(s => !s)}>{showForm ? "Close Form" : "New Leave Request"}</Button>

      {showForm && (
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
          <Button type="button" cancel onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>

      )}

      <SubTitle>My Leave Requests</SubTitle>
      <Divider />

      {leaves.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Type</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <Td>{leave.from}</Td>
                <Td>{leave.to}</Td>
                <Td>{leave.type}</Td>
                <Td>{leave.reason}</Td>
                <Td>
                  <Status status={leave.status}>{leave.status}</Status>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>No leave requests yet</p>
      )}
    </Container>
  );
}

