import styled from "styled-components";

const StatCardGrid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
  margin-bottom: 32px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export default StatCardGrid4;