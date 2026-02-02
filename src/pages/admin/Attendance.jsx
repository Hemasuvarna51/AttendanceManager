import styled from "styled-components";

const Container = styled.div`
  padding: 30px;
  background: #f9f5ec;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fdfbf3;
`;

const Th = styled.th`
  border: 1px solid #444;
  padding: 12px;
`;

const Td = styled.td`
  border: 1px solid #444;
  padding: 12px;
  text-align: center;
`;

const Status = styled.span`
  color: orange;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-right: 6px;
  border: 1px solid #333;
  background: #fff;
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.type === "approve" ? "#d4edda" : "#f8d7da"};
  }
`;

export default function EmployeeLeaveRequests() {
  return (
    <Container>
      <Title>Employee Leave Requests</Title>

      <Table>
        <thead>
          <tr>
            <Th>Employee</Th>
            <Th>From</Th>
            <Th>To</Th>
            <Th>Type</Th>
            <Th>Reason</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <Td>Ramya</Td>
            <Td>2026-02-10</Td>
            <Td>2026-02-12</Td>
            <Td>Sick</Td>
            <Td>Fever</Td>
            <Td><Status>Pending</Status></Td>
            <Td>
              <Button type="approve">Approve</Button>
              <Button>Reject</Button>
            </Td>
          </tr>

          <tr>
            <Td>Suresh</Td>
            <Td>2026-02-05</Td>
            <Td>2026-02-06</Td>
            <Td>Casual</Td>
            <Td>Personal work</Td>
            <Td><Status>Pending</Status></Td>
            <Td>
              <Button type="approve">Approve</Button>
              <Button>Reject</Button>
            </Td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
