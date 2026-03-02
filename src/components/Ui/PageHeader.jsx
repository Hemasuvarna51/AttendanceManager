import styled from "styled-components";
import Button from "./Button";// adjust path if needed

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #0f172a;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 6px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export default function PageHeader({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
  buttonIcon,
  buttonVariant = "primary",
  right, // optional custom content
}) {
  return (
    <Wrapper>
      <Left>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Left>

      <Right>
        {right}
        {buttonLabel && (
          <Button variant={buttonVariant} onClick={onButtonClick}>
            {buttonIcon}
            {buttonLabel}
          </Button>
        )}
      </Right>
    </Wrapper>
  );
}