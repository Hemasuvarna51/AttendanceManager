import React from "react";
import styled from "styled-components";
import { usePayrollStore } from "../store/payroll.store";
import { useEmployeeStore } from "../store/employee.store";

const RecordList = styled.div`
  max-height: 420px;
  overflow: auto;
  display: grid;
  gap: 10px;
  padding-right: 4px;

  /* nicer scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d7e3f3;
    border-radius: 999px;
  }
`;

const RecordItem = styled.div`
  padding: 14px 14px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e6edf6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  &:hover {
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
    border-color: #d7e3f3;
  }
`;

const RecordDate = styled.div`
  font-weight: 1000;
  color: #0f172a;
  font-size: 14px;
`;

export default function PayrollRecords({ userId, userEmail, userName }) {
  const { payrollRecords } = usePayrollStore();
  const { employees } = useEmployeeStore();

  // find corresponding employee record if possible
  const currentEmployee = employees.find(
    (emp) =>
      emp.email?.toLowerCase() === userEmail?.toLowerCase() ||
      emp.name?.toLowerCase() === userName?.toLowerCase() ||
      emp.id === userId
  );

  if (!userId && !userEmail && !userName) {
    return (
      <div style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>
        Unable to load payroll records - user not identified
      </div>
    );
  }

  const employeePayroll = payrollRecords.filter((record) => {
    const matchesId =
      record.employeeId === userId || record.employeeId === currentEmployee?.id;
    const matchesName =
      record.employeeName?.toLowerCase() === userName?.toLowerCase() ||
      record.employeeName?.toLowerCase() === currentEmployee?.name?.toLowerCase();
    return matchesId || matchesName;
  });

  const sortedPayroll = [...employeePayroll].sort((a, b) => {
    const dateA = new Date(a.payPeriodTo || a.createdAt || 0);
    const dateB = new Date(b.payPeriodTo || b.createdAt || 0);
    return dateB - dateA;
  });

  if (sortedPayroll.length === 0) {
    return (
      <div style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
        No payroll records found
      </div>
    );
  }

  return (
    <RecordList>
      {sortedPayroll.map((record, idx) => (
        <RecordItem key={idx}>
          <div>
            <RecordDate>
              {new Date(record.payPeriodTo || record.createdAt).toLocaleDateString()}
            </RecordDate>
            <div
              style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}
            >
              Pay Period: {new Date(record.payPeriodFrom).toLocaleDateString()} -{' '}
              {new Date(record.payPeriodTo).toLocaleDateString()}
            </div>
            <div
              style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}
            >
              {record.hours} hours @ ${record.rate}/hr
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontWeight: "700", fontSize: "14px", color: "#27ae60" }}
            >
              ${Number(record.netPay || 0).toFixed(2)}
            </div>
            <div
              style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}
            >
              Gross: ${Number(record.grossPay || 0).toFixed(2)}
            </div>
          </div>
        </RecordItem>
      ))}
    </RecordList>
  );
}
