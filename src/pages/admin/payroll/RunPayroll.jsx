import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEmployeeStore } from "../../../store/employee.store";

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

const Form = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const Field = styled.div`

  label {
    display: block;
    font-size: 14px;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
    
  }

  input {
    width: 100%;
    
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #2f80ed;
    }
  }
`;

const TableSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;

  th, td {
    padding: 14px 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background: #f9fafc;
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  td {
    font-size: 14px;
    color: #555;
  }

  tbody tr {
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9fafb;
    }
  }

  input {
    width: 90px;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #2f80ed;
    }
  }
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
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #d1d5db;
    transform: translateY(-1px);
  }
`;

const ProcessButton = styled.button`
  background: #2f80ed;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #1f6ed4;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(47, 128, 237, 0.3);
  }
`;

export default function RunPayroll() {
  const navigate = useNavigate();
  const { employees: employeeList } = useEmployeeStore();
  const [payFrom, setPayFrom] = useState("");
  const [payTo, setPayTo] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const activeEmployees = employeeList
      .filter(emp => emp.status === "Active")
      .map(emp => ({
        id: emp.id,
        name: emp.name,
        hours: 0,
        rate: 0,
        deductions: 0,
        taxes: 0
      }));
    setEmployees(activeEmployees);
  }, [employeeList]);

  const updateEmployee = (id, field, value) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, [field]: parseFloat(value) || 0 } : emp
    ));
  };

  const calculateGrossPay = (hours, rate) => hours * rate;
  const calculateNetPay = (gross, deductions, taxes) => gross - deductions - taxes;

  const handleProcess = () => {
    if (!payFrom || !payTo) {
      alert("Please select pay period dates");
      return;
    }

    const payrollData = employees.map(emp => ({
      ...emp,
      grossPay: calculateGrossPay(emp.hours, emp.rate),
      netPay: calculateNetPay(calculateGrossPay(emp.hours, emp.rate), emp.deductions, emp.taxes)
    }));

    navigate("/admin/payroll", { state: { payrollData, payFrom, payTo } });
  };

  return (
    <Container>
      <Title>Run Payroll</Title>

      <Form>
        <Field>
          <label>Pay Period (From)</label>
          <input type="date" value={payFrom} onChange={(e) => setPayFrom(e.target.value)} />
        </Field>
        <Field>
          <label>Pay Period (To)</label>
          <input type="date" value={payTo} onChange={(e) => setPayTo(e.target.value)} />
        </Field>
      </Form>

      <TableSection>
        <h3>Employee Payroll Details</h3>
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
              employees.map(emp => {
                const gross = calculateGrossPay(emp.hours, emp.rate);
                const net = calculateNetPay(gross, emp.deductions, emp.taxes);
                return (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>
                      <input 
                        type="number" 
                        value={emp.hours} 
                        onChange={(e) => updateEmployee(emp.id, 'hours', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={emp.rate} 
                        onChange={(e) => updateEmployee(emp.id, 'rate', e.target.value)} 
                      />
                    </td>
                    <td>${gross.toFixed(2)}</td>
                    <td>
                      <input 
                        type="number" 
                        value={emp.deductions} 
                        onChange={(e) => updateEmployee(emp.id, 'deductions', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={emp.taxes} 
                        onChange={(e) => updateEmployee(emp.id, 'taxes', e.target.value)} 
                      />
                    </td>
                    <td>${net.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No active employees found</td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableSection>

      <Actions>
        <CancelButton onClick={() => navigate("/admin/payroll")}>Cancel</CancelButton>
        <ProcessButton onClick={handleProcess}>Process Payroll</ProcessButton>
      </Actions>
    </Container>
  );
}
