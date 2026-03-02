import styled from "styled-components";

const StyledButton = styled.button`
  background: ${({ $variant }) =>
    $variant === "primary" ? "#4769e6" :
    $variant === "success" ? "#16a34a" :
    $variant === "danger" ? "#dc2626" :
    "#64748b"};

  color: #ffffff;
  padding: 10px 18px;
  border-radius: 14px;
  border: none;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  font-weight: 600;
  cursor: pointer;

  transition: all 220ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export default function Button({ children, variant = "primary", ...props }) {
  return (
    <StyledButton $variant={variant} {...props}>
      {children}
    </StyledButton>
  );
}