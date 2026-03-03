// react import not required by JSX transform, hooks imported individually when needed
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";
import PayrollRecords from "../../components/PayrollRecords";
import { usePayrollStore } from "../../store/payroll.store";
const PayrollContainer = styled.div`
  padding: 30px;
  max-width: 900px;
`;

const PayrollCard = styled.div`
  background: white;
  padding: 20px 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 6px solid #1cc88a;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const PayrollLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const PayrollDate = styled.h4`
  margin: 0;
  font-size: 18px;
`;

const PayrollInfo = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #6c757d;
`;

const PayrollRight = styled.div`
  text-align: right;
`;

const NetAmount = styled.h3`
  margin: 0;
  color: #1cc88a;
`;

const GrossAmount = styled.p`
  margin: 5px 0 0;
  font-size: 13px;
  color: #6c757d;
`;

export default function MyPayroll() {
  const { user } = useAuthStore();
  const payrollRecords = usePayrollStore((state) => state.payrollRecords);

  if (!user) {
    return <PayrollContainer>Please login.</PayrollContainer>;
  }

  const myRecords = payrollRecords.filter(
    (record) => record.employeeId === user.id
  );

  if (myRecords.length === 0) {
    return (
      <PayrollContainer>
        <h2>My Payroll</h2>
        <p>No payroll records found.</p>
      </PayrollContainer>
    );
  }

  return (
    <PayrollContainer>
      <h2>My Payroll</h2>

      {myRecords.map((record) => (
        <PayrollCard key={record.id}>
          <PayrollLeft>
            <PayrollDate>{record.payPeriodTo}</PayrollDate>
            <PayrollInfo>
              Pay Period: {record.payPeriodFrom} - {record.payPeriodTo}
            </PayrollInfo>
            <PayrollInfo>
              {record.hours} hours @ ${record.rate || 0}/hr
            </PayrollInfo>
          </PayrollLeft>

          <PayrollRight>
            <NetAmount>${record.netPay.toFixed(2)}</NetAmount>
            <GrossAmount>
              Gross: ${record.grossPay.toFixed(2)}
            </GrossAmount>
          </PayrollRight>
        </PayrollCard>
      ))}
    </PayrollContainer>
  );
}
