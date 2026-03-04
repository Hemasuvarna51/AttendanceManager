import styled from "styled-components";

const Page = styled.div`
  max-width: ${({ $maxWidth }) => $maxWidth || "1200px"};
  margin: 0 auto;
  padding: ${({ $padding }) => $padding || "28px 22px 40px"};
  background: transparent;
  min-height: ${({ $minHeight }) => $minHeight || "calc(100vh - 60px)"};
`;

export default Page;