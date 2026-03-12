import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Wallet, BadgeDollarSign, ReceiptText } from "lucide-react";
import { useEmployeeStore } from "../../../store/employee.store";
import { usePayrollStore } from "../../../store/payroll.store";
import Page from "../../../layout/Page";
import PageHeader from "../../../components/Ui/PageHeader";

/* =========================
   WRAPPER
========================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

/* =========================
   SUMMARY CARDS
========================= */

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  border-top: 5px solid ${(props) => props.color || "#ddd"};
`;

const SummaryLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SummaryLabel = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
`;

const SummaryValue = styled.span`
  font-size: 24px;
  color: #0f172a;
  font-weight: 800;
  line-height: 1;
`;

const SummaryIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e8f1ff, #f1f7ff);
  color: #2563eb;
`;

/* =========================
   FILTER CARD
========================= */

const FilterCard = styled.div`
  background: #ffffff;
  border: 1px solid #e8eef5;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
`;

const FilterTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #eef4ff;
  color: #2563eb;
`;

const FilterTitle = styled.div`
  h3 {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
    font-weight: 800;
  }

  p {
    margin: 3px 0 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 0.5fr;
  }
`;

const Field = styled.div`
  label {
    display: flex;
    font-size: 13px;
    margin-bottom: 8px;
    color: #0d0e0f;
    font-weight: 700;
  }
  input {
    width: 50;
    box-sizing: border-box;
    padding: 13px 14px;
    border-radius: 12px;
    border: 1px solid #000000;
    background: #f8fbff;
    font-size: 14px;
    color: #0f172a;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #2563eb;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.12);
    }
  }
`;

const InlineAction = styled.button`
  height: 47px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #0b0d12);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
  }
`;

/* =========================
   TABLE SECTION
========================= */

const TableSection = styled.div`
  background: #ffffff;
  border: 1px solid #e8eef5;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 20px 22px;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;

  h3 {
    font-size: 19px;
    font-weight: 800;
    color: #0d1c3d;
    margin: 0;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }
`;

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 1050px;
  border-collapse: separate;
  border-spacing: 0;

  th,
  td {
    padding: 16px 14px;
    border-bottom: 1px solid #eef2f7;
    text-align: left;
    white-space: nowrap;
  }

  th {
    background: #3169b3;
    color: white;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    font-size: 14px;
    color: #0f172a;
    background: #ffffff;
  }

  tbody tr:hover td {
    background: #dde8f4;
  }

  input {
    width: 110px;
    padding: 10px 12px;
    border: 1px solid #dbe5ef;
    border-radius: 10px;
    background: #f8fbff;
    font-size: 13px;
    color: #0f172a;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #2563eb;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }
  }
`;

const EmployeeCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const EmployeeName = styled.span`
  font-weight: 700;
  color: #0f172a;
`;

const EmployeeSub = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const Amount = styled.span`
  font-weight: 800;
  color: #0f172a;
`;

const GrossText = styled(Amount)`
  color: #1d4ed8;
`;

const NetText = styled(Amount)`
  color: #16a34a;
`;

const EmptyState = styled.td`
  text-align: center;
  padding: 34px !important;
  color: #64748b;
  font-weight: 600;
`;

/* =========================
   FOOTER ACTIONS
========================= */

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 2px;
  flex-wrap: wrap;
`;

const CancelButton = styled.button`
  background: #ffffff;
  color: #334155;
  border: 1px solid #dbe5ef;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    transform: translateY(-1px);
  }
`;

const ProcessButton = styled.button`
  background: linear-gradient(135deg, #2563eb, #050a15);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
  }
`;

/* =========================
   COMPONENT
========================= */

export default function RunPayroll() {
  const navigate = useNavigate();
  const { employees: employeeList } = useEmployeeStore();
  const { addPayrollRecords } = usePayrollStore();

  const [payFrom, setPayFrom] = useState("");
  const [payTo, setPayTo] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const activeEmployees = employeeList
      .filter((emp) => emp.status === "Active")
      .map((emp) => ({
        id: emp.id,
        name: emp.name,
        hours: 0,
        rate: 0,
        deductions: 0,
        taxes: 0,
      }));

    setEmployees(activeEmployees);
  }, [employeeList]);

  const updateEmployee = (id, field, value) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, [field]: Number(value) || 0 } : emp
      )
    );
  };

  const calculateGrossPay = (hours, rate) => hours * rate;
  const calculateNetPay = (gross, deductions, taxes) =>
    gross - deductions - taxes;

  const summary = useMemo(() => {
    const totalEmployees = employees.length;
    const totalGross = employees.reduce(
      (sum, emp) => sum + calculateGrossPay(emp.hours, emp.rate),
      0
    );
    const totalTaxes = employees.reduce((sum, emp) => sum + emp.taxes, 0);
    const totalNet = employees.reduce((sum, emp) => {
      const gross = calculateGrossPay(emp.hours, emp.rate);
      return sum + calculateNetPay(gross, emp.deductions, emp.taxes);
    }, 0);

    return {
      totalEmployees,
      totalGross,
      totalTaxes,
      totalNet,
    };
  }, [employees]);

  const handleProcess = () => {
    if (!payFrom || !payTo) {
      alert("Please select pay period dates");
      return;
    }

    if (new Date(payFrom) > new Date(payTo)) {
      alert("Pay period 'From' date cannot be after 'To' date");
      return;
    }

    const payrollData = employees.map((emp) => {
      const grossPay = calculateGrossPay(emp.hours, emp.rate);
      const netPay = calculateNetPay(grossPay, emp.deductions, emp.taxes);

      return {
        ...emp,
        grossPay,
        netPay,
      };
    });

    const payrollRecords = payrollData.map((emp) => ({
      employeeId: emp.id,
      employeeName: emp.name,
      payPeriodFrom: payFrom,
      payPeriodTo: payTo,
      hours: emp.hours,
      rate: emp.rate,
      grossPay: emp.grossPay,
      deductions: emp.deductions,
      taxes: emp.taxes,
      netPay: emp.netPay,
      status: "processed",
    }));

    addPayrollRecords(payrollRecords);
    navigate("/admin/payroll", { state: { payrollData, payFrom, payTo } });
  };

  return (
    <Page>
      <PageHeader title="Run Payroll" />

      <Wrapper>
        <SummaryGrid>
          <SummaryCard color="#2563eb">
            <SummaryLeft>
              <SummaryLabel>Active Employees</SummaryLabel>
              <SummaryValue>{summary.totalEmployees}</SummaryValue>
            </SummaryLeft>
            <SummaryIcon>
              <Wallet size={22} />
            </SummaryIcon>
          </SummaryCard>

          <SummaryCard color="#16a34a">
            <SummaryLeft>
              <SummaryLabel>Total Gross Pay</SummaryLabel>
              <SummaryValue>${summary.totalGross.toFixed(2)}</SummaryValue>
            </SummaryLeft>
            <SummaryIcon>
              <BadgeDollarSign size={22} />
            </SummaryIcon>
          </SummaryCard>

          <SummaryCard color="#f59e0b">
            <SummaryLeft>
              <SummaryLabel>Total Taxes</SummaryLabel>
              <SummaryValue>${summary.totalTaxes.toFixed(2)}</SummaryValue>
            </SummaryLeft>
            <SummaryIcon>
              <ReceiptText size={22} />
            </SummaryIcon>
          </SummaryCard>

          <SummaryCard color="#d8421d">
            <SummaryLeft>
              <SummaryLabel>Total Net Pay</SummaryLabel>
              <SummaryValue>${summary.totalNet.toFixed(2)}</SummaryValue>
            </SummaryLeft>
            <SummaryIcon>
              <Wallet size={22} />
            </SummaryIcon>
          </SummaryCard>
        </SummaryGrid>

        <FilterCard>
          <FilterTop>
            <FilterTitleWrap>
              <FilterIcon>
                <CalendarDays size={20} />
              </FilterIcon>
              <FilterTitle>
                <h3>Payroll Period</h3>
                <p>Select the date range and review employee payouts</p>
              </FilterTitle>
            </FilterTitleWrap>
          </FilterTop>

          <FilterGrid>
            <Field>
              <label>Pay Period From</label>
              <input
                type="date"
                value={payFrom}
                onChange={(e) => setPayFrom(e.target.value)}
              />
            </Field>

            <Field>
              <label>Pay Period To</label>
              <input
                type="date"
                value={payTo}
                onChange={(e) => setPayTo(e.target.value)}
              />
            </Field>

            <InlineAction onClick={handleProcess}>Run Payroll</InlineAction>
          </FilterGrid>
        </FilterCard>

        <TableSection>
          <TableHeader>
            <div>
              <h3>Employee Payroll Details</h3>
              <p>Update work hours, hourly rate, deductions, and tax values</p>
            </div>
          </TableHeader>

          <TableScroll>
            <StyledTable>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Gross Pay</th>
                  <th>Deductions</th>
                  <th>Taxes</th>
                  <th>Net Pay</th>
                </tr>
              </thead>

              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp) => {
                    const gross = calculateGrossPay(emp.hours, emp.rate);
                    const net = calculateNetPay(
                      gross,
                      emp.deductions,
                      emp.taxes
                    );

                    return (
                      <tr key={emp.id}>
                        <td>
                          <EmployeeCell>
                            <EmployeeName>{emp.name}</EmployeeName>
                            <EmployeeSub>Active employee</EmployeeSub>
                          </EmployeeCell>
                        </td>

                        <td>
                          <input
                            type="number"
                            value={emp.hours}
                            onChange={(e) =>
                              updateEmployee(emp.id, "hours", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={emp.rate}
                            onChange={(e) =>
                              updateEmployee(emp.id, "rate", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <GrossText>${gross.toFixed(2)}</GrossText>
                        </td>

                        <td>
                          <input
                            type="number"
                            value={emp.deductions}
                            onChange={(e) =>
                              updateEmployee(emp.id, "deductions", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={emp.taxes}
                            onChange={(e) =>
                              updateEmployee(emp.id, "taxes", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <NetText>${net.toFixed(2)}</NetText>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <EmptyState colSpan="7">No active employees found</EmptyState>
                  </tr>
                )}
              </tbody>
            </StyledTable>
          </TableScroll>
        </TableSection>

        <Actions>
          <CancelButton onClick={() => navigate("/admin/payroll")}>
            Cancel
          </CancelButton>
          <ProcessButton onClick={handleProcess}>
            Process Payroll
          </ProcessButton>
        </Actions>
      </Wrapper>
    </Page>
  );
}