import {useState, useEffect} from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

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
    const location = useLocation();
    const [payFrom, setPayFrom] = useState("");
    const [payTo, setPayTo] = useState("");
    const [payDate, setPayDate] = useState("");
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (location.state?.payrollData) {
            setEmployees(location.state.payrollData);
            setPayFrom(location.state.payFrom || "");
            setPayTo(location.state.payTo || "");
        }
    }, [location.state]);

    const totalHours = employees.reduce((sum, emp) => sum + emp.hours, 0);
    const totalGross = employees.reduce((sum, emp) => sum + emp.grossPay, 0);
    const totalDeductions = employees.reduce((sum, emp) => sum + emp.deductions, 0);
    const totalTaxes = employees.reduce((sum, emp) => sum + emp.taxes, 0);
    const totalNet = employees.reduce((sum, emp) => sum + emp.netPay, 0);

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
                    <h3>{employees.length}</h3>
                </Card>

                <Card>
                    <p>Total Payroll Cost</p>
                    <h3>${totalGross.toFixed(2)}</h3>
                </Card>

                <Card>
                    <p>Taxes & Deductions</p>
                    <h3>${(totalDeductions + totalTaxes).toFixed(2)}</h3>
                </Card>

                <Card>
                    <p>Net Pay</p>
                    <h3><GreenText>${totalNet.toFixed(2)}</GreenText></h3>
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
                        {employees.length > 0 ? (
                            <>
                                {employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>{emp.name}</td>
                                        <td>{emp.hours}</td>
                                        <td>${emp.grossPay.toFixed(2)}</td>
                                        <td>${emp.deductions.toFixed(2)}</td>
                                        <td>${emp.taxes.toFixed(2)}</td>
                                        <td><GreenText>${emp.netPay.toFixed(2)}</GreenText></td>
                                    </tr>
                                ))}
                                <TotalRow>
                                    <td>Totals</td>
                                    <td>{totalHours}</td>
                                    <td>${totalGross.toFixed(2)}</td>
                                    <td>${totalDeductions.toFixed(2)}</td>
                                    <td>${totalTaxes.toFixed(2)}</td>
                                    <td><GreenText>${totalNet.toFixed(2)}</GreenText></td>
                                </TotalRow>
                            </>
                        ) : (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No payroll data. Click "Run Payroll" to process.</td>
                            </tr>
                        )}
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
