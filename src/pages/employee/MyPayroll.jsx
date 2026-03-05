import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";
import { usePayrollStore } from "../../store/payroll.store";

/* ================= Styled Components ================= */

const Container = styled.div`
  padding: 30px;
  max-width: 900px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const PayrollCard = styled.div`
  background: white;
  padding: 22px 25px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 6px solid #1cc88a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: 0.2s;

  &:hover{
    transform: translateY(-3px);
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const PayDate = styled.h4`
  margin: 0;
  font-size: 18px;
`;

const Info = styled.p`
  margin: 4px 0;
  font-size: 14px;
  color: #6c757d;
`;

const Right = styled.div`
  text-align: right;
`;

const NetPay = styled.h3`
  margin: 0;
  color: #1cc88a;
`;

const Gross = styled.p`
  margin: 4px 0;
  font-size: 13px;
  color: #6c757d;
`;

const Empty = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  color: #777;
`;

/* ================= Component ================= */

export default function MyPayroll() {

  const { user } = useAuthStore();
  const payrollRecords = usePayrollStore((state) => state.payrollRecords);

  console.log("Logged user:", user);
  console.log("All payroll records:", payrollRecords);

  if (!user) {
    return <Container>Please login</Container>;
  }

  /* Filter payroll records for logged employee */
  const myRecords = payrollRecords.filter(
  (record) => record.employeeName === user.name
);

  return (
    <Container>
      <Title>My Payroll</Title>

      {myRecords.length === 0 ? (
        <Empty>No payroll records available</Empty>
      ) : (
        myRecords.map((record) => (
          <PayrollCard key={record.id}>

            <Left>
              <PayDate>{record.payPeriodTo}</PayDate>

              <Info>
                Pay Period: {record.payPeriodFrom} — {record.payPeriodTo}
              </Info>

              <Info>
                {record.hours} hrs × ${record.rate}
              </Info>

              <Info>
                Deductions: ${record.deductions} | Taxes: ${record.taxes}
              </Info>
            </Left>

            <Right>
              <NetPay>${record.netPay.toFixed(2)}</NetPay>
              <Gross>Gross: ${record.grossPay.toFixed(2)}</Gross>
            </Right>

          </PayrollCard>
        ))
      )}

    </Container>
  );
}