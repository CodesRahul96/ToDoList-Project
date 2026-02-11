import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { reduceMotion } from "../styles/reduceMotion.styled";

const move = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(5%, 5%); }
  100% { transform: translate(0, 0); }
`;

export const ModernBackground = () => {
  return (
    <BackgroundContainer>
      <GradientOverlay />
      <Blob />
      <Blob2 />
    </BackgroundContainer>
  );
};

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: ${({ theme }) => theme.secondary};
  overflow: hidden;
  transition: background 0.5s ease;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 50% 50%,
    transparent 0%,
    ${({ theme }) => (theme.darkmode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} 100%
  );
`;

const Blob = styled.div`
  position: absolute;
  top: -10%;
  right: -10%;
  width: 50vw;
  height: 50vw;
  background: ${({ theme }) => theme.primary};
  filter: blur(80px);
  opacity: 0.12;
  border-radius: 50%;
  animation: ${move} 20s infinite alternate ease-in-out;
  will-change: transform;
  ${({ theme }) => reduceMotion(theme)}
`;

const Blob2 = styled.div`
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 40vw;
  height: 40vw;
  background: ${({ theme }) => theme.primary};
  filter: blur(60px);
  opacity: 0.08;
  border-radius: 50%;
  animation: ${move} 25s infinite alternate-reverse ease-in-out;
  will-change: transform;
  ${({ theme }) => reduceMotion(theme)}
`;
