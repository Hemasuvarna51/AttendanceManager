// ✅ UPDATED: RequestLeave.jsx (UI matched to the screenshot layout)
// Keeps your existing leave.store logic + user-scoped view

import { useMemo, useState } from "react";
import styled from "styled-components";
import { useLeaveStore } from "../../store/leave.store";
import { useAuthStore } from "../../store/auth.store";
import  luggage_icon from "../../assets/luggage.png";
import cross_icon from "../../assets/close.png";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 26px 26px 40px;
  background: #f4f6fb;
  min-height: calc(100vh - 60px);
`;

const Shell = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin: 10px;
  flex-wrap: wrap;
`;

const Heading = styled.div`
  h1 {
    margin: 0;
    font-size: 26px;
    letter-spacing: -0.4px;
    color: #01216b;
    font-style: italic;
    margin-top: 5px;
    margin-left: 5px;
  }
  p {
    margin: 6px 0 0;
    font-size: 14px;
    color: #64748b;
    font-style: italic;
    margin-top: 10px;
    margin-left: 10px;
  }
`;

const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  background: #133783;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.6px;
  word-spacing: 1px;
  margin-right: 10px;
  margin-top: 5px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.08);
  transition: transform 0.08s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 16px 34px rgba(37, 99, 235, 0.22);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.16);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.22), 0 16px 34px rgba(37, 99, 235, 0.22);
  }
`;

const Panel = styled.div`
  margin-top: 10px;
  background: #fff;
  border: 1px solid #e6e8ee;
  border-radius: 15px;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.06);
  overflow: hidden;
`;

const PanelBody = styled.div`
  padding: 16px;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  border: 1px solid #eef2f7;
  background: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 22px rgba(2, 6, 23, 0.05);
    border-left: 4px solid ${(props) => props.color || "#ddd"};

  .icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-weight: 900;
    border: 1px solid #e6e8ee;
    background: radial-gradient(circle at 30% 30%, #dbeafe, #f8fafc);
    color: #1d4ed8;
  }

  .k {
    font-size: 12px;
    color: #33363a;
    font-weight: 800;
    margin-bottom: 2px;
    letter-spacing: 0.2px;
  }

  .v {
    font-size: 18px;
    color: #0f172a;
    font-weight: 900;
    letter-spacing: -0.2px;
  }
`;

const Toolbar = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Tabs = styled.div`
  display: inline-flex;
  gap: 28px;
  padding: 6px;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e6e8ee;
`;

const Tab = styled.button`
  border: 0;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.3px;
  color: ${({ $active }) => ($active ? "#fff" : "#0f172a")};
  background: ${({ $active }) => ($active ? "#133783" : "transparent")};
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#133783" : "#e9eef9")};
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
  }
`;

const Dots = styled.div`
  color: #94a3b8;
  font-weight: 900;
  letter-spacing: 2px;
  user-select: none;
`;

const TableWrap = styled.div`
  margin-top: 12px;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 12px;
    border-bottom: 1px solid #eef2f7;
    text-align: left;
    font-size: 14.6px;
    color: #000000;
  }

  th {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    word-spacing: 0.8px;
    color: #33363a;
    background: #f8fafc;
  }

  tbody tr:hover {
    background: #fbfdff;
  }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid
    ${({ $status }) =>
      $status === "Approved" ? "#bbf7d0" : $status === "Rejected" ? "#fecaca" : "#fde68a"};
  background: ${({ $status }) =>
    $status === "Approved" ? "#f0fdf4" : $status === "Rejected" ? "#fff1f2" : "#fffbeb"};
  color: ${({ $status }) =>
    $status === "Approved" ? "#166534" : $status === "Rejected" ? "#991b1b" : "#92400e"};

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${({ $status }) =>
      $status === "Approved" ? "#22c55e" : $status === "Rejected" ? "#ef4444" : "#f59e0b"};
    box-shadow: 0 0 0 4px
      ${({ $status }) =>
        $status === "Approved"
          ? "rgba(34,197,94,0.16)"
          : $status === "Rejected"
          ? "rgba(239,68,68,0.16)"
          : "rgba(245,158,11,0.18)"};
  }
`;

const EmptyState = styled.div`
  margin-top: 12px;
  min-height: 260px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #eef2f7;
  display: grid;
  place-items: center;
  padding: 20px;
`;

const EmptyInner = styled.div`
  text-align: center;
  max-width: 520px;
  place-items: center;

  h3 {
    margin: 10px 0 6px;
    font-size: 17px;
    letter-spacing: -0.2px;
    color: #0f172a;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
    font-style: italic;
  }
`;

const EmptyIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: radial-gradient(circle at 30% 30%, #afd2ff, #f8fafc);
  border: 1px solid #e6e8ee;
  display: grid;
  place-items: center;
  box-shadow: 0 16px 34px rgba(2, 6, 23, 0.08);
  font-size: 34px;

  img{
    margin-left: 8px;
    width: 60px;
  }
`;

/* ===== Modal (New Leave Request) ===== */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.55);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
  backdrop-filter: blur(6px);
`;

const Modal = styled.div`
  width: min(720px, 96vw);
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 40px 90px rgba(2, 6, 23, 0.35);
  overflow: hidden;
`;

const ModalHead = styled.div`
  padding: 13px 20px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: italic;
  gap: 12px;
  background: #133683e4;

  h3 {
    margin: 0;
    font-size: 19px;
    font-weight: 100;
    color: #ffffff;
    letter-spacing: 0.5px;
  }
`;

const CloseBtn = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: 1000;
  color: #eeeeee;
  background: #2e4c8d;

`;

const ModalBody = styled.div`
  padding: 16px;
  border: 1px solid #dfdfdf;
  margin: 15px;
  border-radius: 15px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 100;
    color: #000000;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  input,
  select,
  textarea {
    padding: 10px 12px;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    background: #fff;
    font-size: 14px;
    color: #9e9e9e;
    outline: none;
    transition: box-shadow 0.15s ease, border-color 0.15s ease;

    &:focus {
      border-color: #133683c9;
      border-radius: 5px;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.14);
    }
  }

  .reason-text{
    color: #2a2a2a;
  }

  .leave-type{
    color: black;
  }


  textarea {
    resize: none;
    min-height: 96px;
  }
  option{
    background: #5b5b5b;
    color: white;
  }
`;

const Full = styled.div`
  grid-column: 1 / -1;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
`;

const GhostBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 5px;
  border: 1px solid #bababa;
  background: #fff;
  color: #3e3e3e;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const SaveBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 5px;
  border: none;
  background: #133783;
  color: #fff;
  font-weight: 100;
  cursor: pointer;

  &:hover {
    box-shadow: 0 14px 30px rgba(37, 99, 235, 0.2);
    transform: translateY(-1px);
  }
`;

/* ===================== COMPONENT ===================== */

export default function RequestLeave() {
  const { addLeave, leaves } = useLeaveStore();
  const user = useAuthStore((s) => s.user);

  const userId = user?.id ?? user?.email ?? user?.name ?? null;

  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("All");

  const initialFormData = {
    empId: "",
    empName: "",
    fromDate: "",
    toDate: "",
    reason: "",
    leaveType: "Casual Leave",
  };

  const [formData, setFormData] = useState(initialFormData);

  const myLeaves = useMemo(() => {
    const scoped = userId ? leaves.filter((l) => l.userId === userId) : [];
    const norm = scoped.map((l) => ({
      ...l,
      status: l.status || "Pending",
    }));

    if (tab === "Pending") return norm.filter((l) => l.status === "Pending");
    if (tab === "Approved") return norm.filter((l) => l.status === "Approved");
    if (tab === "Rejected") return norm.filter((l) => l.status === "Rejected");
    return norm;
  }, [leaves, userId, tab]);

  const counts = useMemo(() => {
    const scoped = userId ? leaves.filter((l) => l.userId === userId) : [];
    const status = (s) => scoped.filter((l) => (l.status || "Pending") === s).length;
    return {
      pending: status("Pending"),
      approved: status("Approved"),
      rejected: status("Rejected"),
    };
  }, [leaves, userId]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(initialFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Please login again.");
      return;
    }

    const leaveData = {
      userId,
      employee: formData.empName || user?.name,
      empId: formData.empId || user?.empId,
      email: user?.email,
      from: formData.fromDate,
      to: formData.toDate,
      type: formData.leaveType,
      reason: formData.reason,
    };

    console.log('LeaveRequest - Submitting leave:', leaveData);
    addLeave(leaveData);

    setShowForm(false);
    setFormData(initialFormData);
    alert("Leave request submitted successfully!");
  };

  if (!userId) {
    return (
      <Page>
        <Shell>
          <TopBar>
            <Heading>
              <h1>Leave Management</h1>
              <p>⚠️ Please login to view your leave requests.</p>
            </Heading>
          </TopBar>
        </Shell>
      </Page>
    );
  }

  return (
    <Page>
      <Shell>
        <TopBar>
          <Heading>
            <h1>Leave Management</h1>
            <p>Plan and manage your leave requests seamlessly.</p>
          </Heading>

          <PrimaryBtn type="button" onClick={() => setShowForm(true)}>
            ✛ New Leave
          </PrimaryBtn>
        </TopBar>

        <Panel>
          <PanelBody>
            <StatRow>
              <StatCard color="#0b3af5ff">
                <div className="icon">⏳</div>
                <div>
                  <div className="k">Pending</div>
                  <div className="v">{counts.pending}</div>
                </div>
              </StatCard>

              <StatCard color="#16a34a">
                <div className="icon" style={{ color: "#16a34a" }}>
                  ✅
                </div>
                <div>
                  <div className="k">Approved</div>
                  <div className="v">{counts.approved}</div>
                </div>
              </StatCard>

              <StatCard color="#ef4444">
                <div className="icon" style={{ color: "#ef4444" }}>
                  ✖
                </div>
                <div>
                  <div className="k">Rejected</div>
                  <div className="v">{counts.rejected}</div>
                </div>
              </StatCard>
            </StatRow>

            <Toolbar>
              <Tabs>
                <Tab $active={tab === "All"} onClick={() => setTab("All")}>
                  All
                </Tab>
                <Tab $active={tab === "Pending"} onClick={() => setTab("Pending")}>
                  Pending
                </Tab>
                <Tab $active={tab === "Approved"} onClick={() => setTab("Approved")}>
                  Approved
                </Tab>
                <Tab $active={tab === "Rejected"} onClick={() => setTab("Rejected")}>
                  Rejected
                </Tab>
              </Tabs>

              <Dots>•••</Dots>
            </Toolbar>

            {myLeaves.length > 0 ? (
              <TableWrap>
                <Table>
                  <thead>
                    <tr>
                      <th>Leave Period</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>
                          {leave.from} → {leave.to}
                        </td>
                        <td>{leave.type}</td>
                        <td>{leave.reason}</td>
                        <td>
                          <Status $status={leave.status}>
                            <span className="dot" />
                            {leave.status}
                          </Status>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            ) : (
              <EmptyState>
                <EmptyInner>
                  <EmptyIcon aria-hidden="true"><img src={luggage_icon}/></EmptyIcon>
                  <h3>No Leave Requests Found</h3>
                  <p>You have not submitted any leave requests yet.</p>
                </EmptyInner>
              </EmptyState>
            )}
          </PanelBody>
        </Panel>

        {/* ===== Modal form (like screenshot flow) ===== */}
        {showForm && (
          <Backdrop onClick={handleCancel}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalHead>
                <h3>New Leave Request</h3>
                <CloseBtn onClick={handleCancel} aria-label="Close">
                ✕
                </CloseBtn>
              </ModalHead>

              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <Field>
                    <label>Emp ID</label>
                    <input
                      type="text"
                      name="empId"
                      value={formData.empId}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <label>Emp Name</label>
                    <input
                      type="text"
                      name="empName"
                      value={formData.empName}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <label>From Date</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <label>To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <label>Leave Type</label>
                    <select className="leave-type" name="leaveType" value={formData.leaveType} onChange={handleChange}>
                      <option>Casual Leave</option>
                      <option>Sick Leave</option>
                      <option>Earned Leave</option>
                    </select>
                  </Field>

                  <Field className="spacer" />

                  <Field className={Full.styledComponentId}>
                    <label>Reason</label>
                    <textarea 
                    className="reason-text"
                      name="reason"
                      rows="4"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <div className={Full.styledComponentId}>
                    <ModalActions>
                      <GhostBtn type="button" onClick={handleCancel}>
                        Cancel
                      </GhostBtn>
                      <SaveBtn type="submit">Submit</SaveBtn>
                    </ModalActions>
                  </div>
                </Form>
              </ModalBody>
            </Modal>
          </Backdrop>
        )}
      </Shell>
    </Page>
  );
}