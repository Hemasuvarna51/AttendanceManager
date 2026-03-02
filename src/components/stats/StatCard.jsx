import styled from "styled-components";

/* ✅ Define child components first (so Card can reference them) */

const Label = styled.div`
  font-size: 13px;
  opacity: 0.92;
  font-weight: 600;
  letter-spacing: 0.1px;
  position: relative;
  z-index: 1;

  transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 280ms ease;
`;

const Value = styled.div`
  margin-top: 10px;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.6px;
  position: relative;
  z-index: 1;

  transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    letter-spacing 280ms ease;
`;

const Card = styled.div`
  border-radius: 18px;
  padding: 18px 18px 16px;
  position: relative;
  overflow: hidden;
  color: #fff;

  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.08);

  
  will-change: transform, box-shadow, filter;

  transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 280ms cubic-bezier(0.2, 0.8, 0.2, 1);

  background: ${({ $bg, $variant }) => {
    if ($bg) return $bg; // ✅ override
    if ($variant === "blue")
      return "linear-gradient(135deg, #2f6dff 0%, #5aa1ff 100%)";
    if ($variant === "red")
      return "linear-gradient(135deg, #e34c4c 0%, #ff7a7a 100%)";
    if ($variant === "green")
      return "linear-gradient(135deg, #2e8b78 0%, #6fc3a5 100%)";
    return "linear-gradient(135deg, #f49b36 0%, #ffc06a 100%)";
  }};

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:active {
    transform: ${({ $clickable }) => ($clickable ? "translateY(-4px) scale(1.01)" : "none")};
  }

  /* background glow blob */
  &:after {
    content: "";
    position: absolute;
    inset: -40px -60px auto auto;
    width: 180px;
    height: 180px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1);
    transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  /* ✅ Card hover */
  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 30px 70px rgba(2, 6, 23, 0.18);
    filter: brightness(1.06);
  }

  &:hover::after {
    transform: scale(1.35);
  }

  /* ✅ Text elevation on hover */
  &:hover ${Label} {
    transform: translateY(-2px);
    opacity: 1;
  }

  &:hover ${Value} {
    transform: translateY(-3px);
    letter-spacing: -0.3px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  position: relative;
  z-index: 1;
`;

const IconChip = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.24);
  position: relative;
  z-index: 1;
`;

const Foot = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

export default function StatCard({
  label,
  value,
  icon,
  variant = "blue",
  footer,
  onClick,
  bg,
}) {
  const clickable = typeof onClick === "function";

  return (
    <Card
      as={clickable ? "button" : "div"}
      type={clickable ? "button" : undefined}
      onClick={onClick}
      $clickable={clickable}
      $variant={variant}
      $bg={bg}
      style={{
        width: "100%",
        border: "none",
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      <Top>
        <Label>{label}</Label>
        <IconChip>{icon}</IconChip>
      </Top>

      <Value>{value}</Value>

      {footer ? <Foot>{footer}</Foot> : null}
    </Card>
  );
}