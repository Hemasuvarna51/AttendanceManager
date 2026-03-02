import styled from "styled-components";

const StatCardGrid5 = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export default StatCardGrid5;