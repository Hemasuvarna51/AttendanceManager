import {useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ================= Styled Components ================= */

const Container = styled.div`
  padding: 30px;
  background: #f6f7fb;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 26px;
  font-weight: 600;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 25px;
`;

const Filters = styled.div`
  display: flex;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 13px;
    margin-bottom: 5px;
    color: #555;
  }

  input {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
`;


const RunButton = styled.button`
  background: #2f80ed;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1f6ed4;
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);

  p {
    color: #777;
    font-size: 14px;
  }

  h3 {
    margin-top: 8px;
  }
`;

const GreenText = styled.span`
  color: #27ae60;
`;

const Status = styled.div`
  margin-bottom: 20px;
`;

const Progress = styled.div`
  height: 8px;
  background: #ddd;
  border-radius: 10px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: 40%;
  height: 100%;
  background: #2f80ed;
`;

const TableSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;

  th, td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background: #f9fafc;
    font-weight: 600;
  }
`;

const TotalRow = styled.tr`
  background: #f3f4f6;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  background: #e5e7eb;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #d1d5db;
  }
`;

const ApproveButton = styled.button`
  background: #2f80ed;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1f6ed4;
  }
`;

/* ================= Component ================= */

export default function Payroll() {
    const navigate = useNavigate();
    const [payFrom, setPayFrom] = useState("");
    const [payTo, setPayTo] = useState("");
    const [payDate, setPayDate] = useState("");

    return (
        <Container>
            <Title>Payroll Summary</Title>

            <TopSection>
                <Filters>
                    <Field>

                    </Field>
                    <label>Pay Period (From)</label>
                    <input
                        type="date"
                        value={payFrom}
                        onChange={(e) => setPayFrom(e.target.value)}
                    />

                    <Field>
                        <label>Pay Period (To)</label>
                        <input
                            type="date"
                            value={payTo}
                            onChange={(e) => setPayTo(e.target.value)}
                        />

                    </Field>
                    <Field>
                        <label>Pay Date</label>
                        <select>
                            <option>Jan 15, 2022</option>
                        </select>
                    </Field>
                </Filters>

                <RunButton onClick={() => navigate("/admin/payroll/run")}>+ Run Payroll</RunButton>
            </TopSection>

            <SummaryCards>
                <Card>
                    <p>Total Employees</p>
                    <h3>25</h3>
                </Card>

                <Card>
                    <p>Total Payroll Cost</p>
                    <h3>$58,750.00</h3>
                </Card>

                <Card>
                    <p>Taxes & Deductions</p>
                    <h3>$12,450.00</h3>
                </Card>

                <Card>
                    <p>Net Pay</p>
                    <h3><GreenText>$46,300.00</GreenText></h3>
                </Card>
            </SummaryCards>

            <Status>
                <span>Payroll Status: <b>Processing</b></span>
                <Progress>
                    <ProgressBar />
                </Progress>
            </Status>

            <TableSection>
                <h3>Employee Payroll Overview</h3>

                <StyledTable>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Hours</th>
                            <th>Gross Pay</th>
                            <th>Deductions</th>
                            <th>Taxes</th>
                            <th>Net Pay</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>John Smith</td>
                            <td>80</td>
                            <td>$3,500.00</td>
                            <td>$500.00</td>
                            <td>$850.00</td>
                            <td><GreenText>$2,150.00</GreenText></td>
                        </tr>

                        <tr>
                            <td>Lisa Johnson</td>
                            <td>75</td>
                            <td>$3,200.00</td>
                            <td>$450.00</td>
                            <td>$800.00</td>
                            <td><GreenText>$1,950.00</GreenText></td>
                        </tr>

                        <tr>
                            <td>Michael Brown</td>
                            <td>40</td>
                            <td>$1,600.00</td>
                            <td>$200.00</td>
                            <td>$300.00</td>
                            <td><GreenText>$1,100.00</GreenText></td>
                        </tr>

                        <tr>
                            <td>Emma Davis</td>
                            <td>85</td>
                            <td>$3,750.00</td>
                            <td>$600.00</td>
                            <td>$900.00</td>
                            <td><GreenText>$2,250.00</GreenText></td>
                        </tr>

                        <TotalRow>
                            <td>Totals</td>
                            <td>—</td>
                            <td>$12,050.00</td>
                            <td>$1,750.00</td>
                            <td>$2,850.00</td>
                            <td><GreenText>$7,450.00</GreenText></td>
                        </TotalRow>
                    </tbody>
                </StyledTable>
            </TableSection>

            <Actions>
                <CancelButton>Cancel</CancelButton>
                <ApproveButton onClick={() => navigate("/admin/payroll/approved")}>Approve Payroll</ApproveButton>
            </Actions>
        </Container>
    );
}
