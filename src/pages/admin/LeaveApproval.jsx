import styled from "styled-components";
import { useLeaveStore } from "../../store/leave.store";

/* ===================== STYLES ===================== */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
`;

const Title = styled.h2`
  margin: 0 0 16px;
`;

const Section = styled.div`
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
`;

const SectionHeader = styled.div`
  padding: 14px 16px;
  background: #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #fafafa;
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
  background: ${(props) => (props.approve ? "#16a34a" : "#dc2626")};
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ===================== COMPONENT ===================== */

export default function AdminLeaveRequests() {
  const { leaves, updateLeaveStatus } = useLeaveStore();

  const grouped = leaves.reduce((acc, l) => {
    const key = l.userId || "UNKNOWN_USER";
    (acc[key] ||= []).push(l);
    return acc;
  }, {});

  const userIds = Object.keys(grouped);

  return (
    <Container>
      <Title>Admin - Leave Requests</Title>

      {userIds.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
          No leave requests
        </p>
      ) : (
        userIds.map((userId) => (
          <Section key={userId}>
            <SectionHeader>
              <div>User: {userId}</div>
              <Badge>{grouped[userId].length} requests</Badge>
            </SectionHeader>

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
                {grouped[userId].map((leave) => (
                  <tr key={leave.id}>
                    <Td>{leave.employee}</Td>
                    <Td>{leave.from}</Td>
                    <Td>{leave.to}</Td>
                    <Td>{leave.type}</Td>
                    <Td>{leave.reason}</Td>
                    <Td>
                      <Status status={leave.status || "Pending"}>
                        {leave.status || "Pending"}
                      </Status>
                    </Td>
                    <Td>
                      <Actions>
                        <Button
                          approve
                          disabled={(leave.status || "Pending") !== "Pending"}
                          onClick={() => updateLeaveStatus(leave.id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          disabled={(leave.status || "Pending") !== "Pending"}
                          onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Actions>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Section>
        ))
      )}
    </Container>
  );
}