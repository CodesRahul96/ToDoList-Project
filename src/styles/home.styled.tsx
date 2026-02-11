import styled from "@emotion/styled";
import { fadeIn, progressPulse, pulseAnimation, scale } from "./keyframes.styled";
import { Box, Button, CircularProgress, css, IconButton } from "@mui/material";
import { getFontColor } from "../utils";
import { reduceMotion } from ".";

export const GreetingHeader = styled.div`
  display: flex;
  margin-top: 16px;
  font-family: "Plus Jakarta Sans", sans-serif !important;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-left: 8px;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 1024px) {
    font-size: 28px;
    margin-top: 8px;
  }

  @media (max-width: 600px) {
    font-size: 24px;
    margin-left: 0;
    justify-content: center;
  }
`;

export const TasksCountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0;
  
  @media (max-width: 600px) {
    margin: 20px 0;
  }
`;

export const TasksCount = styled("div", {
  shouldForwardProp: (prop) => prop !== "glow",
})<{ glow: boolean }>`
  position: relative;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) =>
    theme.darkmode ? "rgba(30, 41, 59, 0.45)" : "rgba(255, 255, 255, 0.5)"};
  backdrop-filter: blur(20px) saturate(160%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 28px;
  padding: 32px 40px;
  border-radius: 32px;
  width: 100%;
  max-width: 800px;
  border: 1px solid ${({ theme }) => (theme.darkmode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.6)")};
  box-shadow: ${({ theme }) =>
    theme.darkmode 
      ? "0 20px 40px -12px rgba(0, 0, 0, 0.4)" 
      : "0 15px 35px -12px rgba(0, 0, 0, 0.08)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) =>
      theme.darkmode 
        ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
        : "0 20px 45px -12px rgba(0, 0, 0, 0.12)"};
  }

  @media (max-width: 1024px) {
    padding: 24px 32px;
    gap: 20px;
  }

  @media (max-width: 600px) {
    padding: 24px 20px;
    border-radius: 24px;
    gap: 16px;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    backdrop-filter: blur(12px);
  }
`;

export const TaskCountClose = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.8;
  color: ${({ theme }) => getFontColor(theme.secondary)};
`;

export const TaskCountTextContainer = styled.div`
  line-height: 1.7;
  margin-left: 6px;
`;

export const TaskCountHeader = styled.h4`
  margin: 0;
  font-size: 16px;
  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;

export const TaskCompletionText = styled.p`
  margin: 0;
  font-size: 16px;
`;

export const ProgressPercentageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "glow",
})<{ glow: boolean }>`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) =>
    theme.darkmode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"};
  border-radius: 100px;
  margin: -4px;
  border: 1px solid ${({ theme }) => theme.primary}40;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  & .MuiTypography-root {
    color: ${({ theme }) => theme.text.primary};
    font-weight: 700;
  }
  animation: ${({ theme, glow }) =>
    glow
      ? css`
          ${progressPulse(theme.primary)} 3s infinite ease-in-out
        `
      : "none"};

  ${({ theme }) => reduceMotion(theme)}
`;

export const StyledProgress = styled(CircularProgress, {
  shouldForwardProp: (prop) => prop !== "glow",
})<{ glow: boolean }>`
  z-index: 1;
  margin: 2px;
  filter: ${({ glow, theme }) => (glow ? `drop-shadow(0 0 6px ${theme.primary}c8)` : "none")};
  transition: 0.3s filter;
`;

export const AddButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "animate" && prop !== "glow",
})<{ animate?: boolean; glow: boolean }>`
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 32px;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  right: 16vw;
  box-shadow: ${({ glow, theme }) =>
    glow ? `0 10px 25px -5px ${theme.primary}80` : "0 4px 12px rgba(0,0,0,0.1)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px) rotate(90deg);
    background-color: ${({ theme }) => theme.primary};
    box-shadow: ${({ theme }) => `0 15px 30px -5px ${theme.primary}a0`};
  }

  & svg {
    font-size: 32px;
  }

  animation: ${scale} 0.5s;
  ${({ animate, theme }) =>
    animate &&
    css`
      animation: ${pulseAnimation(theme.primary, 14)} 1.2s infinite;
    `}

  ${({ theme }) => reduceMotion(theme)}

  @media (max-width: 1024px) {
    right: 24px;
    bottom: 24px;
  }

  @media print {
    display: none;
  }
`;

export const Offline = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  text-shadow: 0 0 8px #ffffff56;
  margin-top: 20px;
  opacity: 0.8;
  animation: ${fadeIn} 0.5s ease;
`;
