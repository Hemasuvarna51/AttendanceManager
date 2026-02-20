import { useState } from "react";
import styled from "styled-components";
import { useEmployeeStore } from "../../store/employee.store";
import { useLeaveStore } from "../../store/leave.store";

/* ===================== STYLES ===================== */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
`;

const TableWrapper = styled.div`
  background: #fff
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
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

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  cursor: pointer;
  font-size: 13px;

  background: ${(props) =>
    props.approve ? "#16a34a" : "#dc2626"};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ===================== COMPONENT ===================== */

export default function EmployeeLeaveRequests() {
  const { employees } = useEmployeeStore();
  const { leaves, updateLeaveStatus } = useLeaveStore();
  
  const updateStatus = (id, status) => {
    updateLeaveStatus(id, status);
  };

  return (
    <Container>
      <Header>
        <Title>Employee Leave Requests</Title>
      </Header>

      <TableWrapper>
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
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <Td>{leave.employee}</Td>
                  <Td>{leave.from}</Td>
                  <Td>{leave.to}</Td>
                  <Td>{leave.type}</Td>
                  <Td>{leave.reason}</Td>
                  <Td>
                    <Status status={leave.status}>
                      {leave.status}
                    </Status>
                  </Td>
                  <Td>
                    <Actions>
                      <Button
                        approve
                        disabled={leave.status !== "Pending"}
                        onClick={() =>
                          updateStatus(leave.id, "Approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        disabled={leave.status !== "Pending"}
                        onClick={() =>
                          updateStatus(leave.id, "Rejected")
                        }
                      >
                        Reject
                      </Button>
                    </Actions>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No leave requests</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
}