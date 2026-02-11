import styled from "@emotion/styled";
import { Avatar, AvatarProps, Button, css, Paper } from "@mui/material";
import { getFontColor } from "../utils";
import { CSSProperties } from "react";
import { pulseAnimation, scale } from "./keyframes.styled";
import { reduceMotion } from "./reduceMotion.styled";

export const DialogBtn = styled(Button)`
  padding: 12px 28px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  margin: 8px;
  text-transform: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.01em;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -4px ${({ theme }) => theme.primary}40;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StyledLink = styled.a<{ clr?: string }>`
  cursor: pointer;
  color: ${({ clr, theme }) => clr || theme.primary};
  display: inline-block;
  position: relative;
  text-decoration: none;
  font-weight: 600;
  transition: 0.3s all;
  
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: ${({ clr, theme }) => clr || theme.primary};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
    border-radius: 100px;
    opacity: 0.7;
  }
  
  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;
// linear-gradient(#A4AAB7, #868B95)

interface UserAvatarProps {
  hasimage: boolean;
  size: CSSProperties["height"];
  pulse?: boolean;
}

const UnstyledAvatar = ({ ...props }: AvatarProps) => (
  <Avatar translate={"no"} slotProps={{ img: { loading: "lazy" } }} {...props} />
);

export const UserAvatar = styled(UnstyledAvatar, {
  shouldForwardProp: (prop) => prop !== "hasimage" && prop !== "pulse" && prop !== "size",
})<UserAvatarProps>`
  color: #ffffff;
  background: ${({ hasimage, theme }) =>
    hasimage ? "rgba(255, 255, 255, 0.12)" : theme.darkmode ? "#2d2d35" : "#e2e8f0"} !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  font-size: ${({ size }) => `calc(${size} / 2.2)`};
  border: 2px solid ${({ theme }) => theme.primary}40;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  ${({ pulse, theme }) =>
    pulse &&
    css`
      animation: ${pulseAnimation(theme.darkmode ? "#4a4a55" : "#cbd5e1", 12)} 1.5s ease-in-out
        infinite;
    `}
`;

interface ColorElementProps {
  clr?: string;
  secondClr?: string;
  size?: string;
  disableHover?: boolean;
}

// Styled button for color selection
export const ColorElement = styled("button", {
  shouldForwardProp: (prop) =>
    prop !== "clr" && prop !== "secondClr" && prop !== "size" && prop !== "disableHover",
})<ColorElementProps>`
  background: ${({ clr, secondClr }) =>
    !clr
      ? "transparent"
      : secondClr
        ? `linear-gradient(135deg, ${clr} 50%, ${secondClr} 50%)`
        : clr};

  color: ${({ clr }) => (clr ? getFontColor(clr) : "transparent")};
  border: none;
  cursor: pointer;
  width: ${({ size }) => size || "48px"};
  height: ${({ size }) => size || "48px"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  transition:
    0.2s all,
    0s border;
  transform: scale(1);

  &:focus-visible {
    outline: 4px solid ${({ theme }) => theme.primary};
  }

  &:hover {
    /* transform: scale(1.05); */
    box-shadow: ${({ clr, disableHover }) => (!disableHover ? `0 0 12px ${clr}` : "none")};
    /* outline: none; */
  }
`;

export const PathName = styled.code`
  background: #000000c8;
  color: white;
  font-family: consolas !important;
  padding: 4px 6px;
  border-radius: 8px;
`;

export const PulseLabel = styled.div`
  animation: ${({ theme }) => pulseAnimation(theme.primary, 8)} 1.2s infinite;
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: ${({ theme }) => theme.primary};
  border-radius: 32px;
  z-index: 1;
`;

export const VisuallyHiddenInput = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1;
`;

export const ToastIconWrapper = styled.div<{ bgColor: string }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ bgColor }) => bgColor};
  flex-shrink: 0;
  animation: ${scale} 0.4s ease-in-out;
  ${({ theme }) => reduceMotion(theme)}
  & svg {
    font-size: 16px;
  }
`;

export const GlassCard = styled(Paper)`
  padding: 40px;
  border-radius: 32px;
  background: ${({ theme }) =>
    theme.darkmode ? "rgba(30, 41, 59, 0.45)" : "rgba(255, 255, 255, 0.5)"} !important;
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid ${({ theme }) => (theme.darkmode ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.6)")};
  box-shadow: ${({ theme }) =>
    theme.darkmode
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      : "0 20px 40px -12px rgba(0, 0, 0, 0.08)"};
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  &:hover {
    box-shadow: ${({ theme }) =>
      theme.darkmode
        ? "0 30px 60px -12px rgba(0, 0, 0, 0.6)"
        : "0 25px 50px -12px rgba(0, 0, 0, 0.12)"};
    transform: translateY(-2px);
  }

  @media (max-width: 1024px) {
    padding: 32px;
    border-radius: 28px;
    gap: 20px;
  }

  @media (max-width: 600px) {
    padding: 24px 16px;
    border-radius: 24px;
    gap: 16px;
    backdrop-filter: blur(16px);
  }
`;
