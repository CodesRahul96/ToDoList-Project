import styled from "@emotion/styled";
import { Alarm, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { Checkbox, IconButton, TextField, css } from "@mui/material";
import { fadeIn, ring, scale, scaleIn } from "../../styles/keyframes.styled";
import { getFontColor, systemInfo } from "../../utils";
import { reduceMotion } from "../../styles/reduceMotion.styled";

// TODO: move EmojiContainer to top on smaller screens, fix text spacing

interface TaskComponentProps {
  backgroundColor: string;
  done: boolean;
  glow?: boolean;
  blur?: boolean;
  isDragging?: boolean;
  index?: number;
}

export const TaskContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "backgroundColor" &&
    prop !== "done" &&
    prop !== "glow" &&
    prop !== "blur" &&
    prop !== "isDragging" &&
    prop !== "index",
})<TaskComponentProps>`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-radius: 28px;
  margin-top: 16px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${({ backgroundColor }) => getFontColor(backgroundColor)};
  background-color: ${({ backgroundColor, done }) =>
    done ? `${backgroundColor}90` : `${backgroundColor}cc`};
  border: 1px solid ${({ backgroundColor }) => `${backgroundColor}30`};
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow: ${({ glow, backgroundColor, blur, done }) =>
    glow && !blur && !done
      ? `0 12px 30px -10px ${backgroundColor}80`
      : "0 6px 16px rgba(0, 0, 0, 0.08)"};
  filter: ${({ blur }) => (blur ? "blur(6px) opacity(60%)" : "none")};
  animation: ${scaleIn} 0.45s cubic-bezier(0.2, 0, 0.2, 1) both;
  animation-delay: ${({ index }) => (index ? `${index * 0.04}s` : "0s")};

  &:hover {
    transform: translateY(-3px) scale(1.005);
    box-shadow: ${({ glow, backgroundColor, blur, done }) =>
      glow && !blur && !done
        ? `0 20px 45px -12px ${backgroundColor}a0`
        : "0 12px 28px rgba(0, 0, 0, 0.12)"};
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 4px;
    background: #00ff1e;
    border-radius: 0 4px 4px 0;
    opacity: ${({ done }) => (done ? 1 : 0)};
    transition: opacity 0.3s ease;
  }

  ${({ theme }) => reduceMotion(theme)}

  @media (max-width: 1024px) {
    padding: 14px 18px;
    margin-top: 12px;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    margin-top: 10px;
    border-radius: 18px;
  }
`;

export const EmojiContainer = styled.span<{ clr: string }>`
  text-decoration: none;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  font-size: 32px;
  padding: 10px;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
`;

export const TaskCategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
  justify-content: left;
  align-items: center;
`;

export const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const TaskName = styled.h3<{ done: boolean }>`
  font-family: "Plus Jakarta Sans", sans-serif !important;
  font-size: 19px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  text-decoration: ${({ done }) => (done ? "line-through" : "none")};
  opacity: ${({ done }) => (done ? 0.6 : 1)};
  word-break: break-word;
`;

export const TaskDate = styled.p`
  margin: 0;
  font-size: 12px;
  opacity: 0.7;
  font-weight: 500;
  white-space: nowrap;
`;

export const TaskDescription = styled.div<{ done: boolean }>`
  margin: 2px 0 6px 0;
  font-size: 15px;
  line-height: 1.5;
  opacity: ${({ done }) => (done ? 0.5 : 0.8)};
  text-decoration: ${({ done }) => (done ? "line-through" : "none")};
  word-break: break-word;
`;

export const NoTasks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 320px;
  gap: 16px;
  color: ${({ theme }) => theme.text.primary};
  opacity: 0.9;
  font-family: "Plus Jakarta Sans", sans-serif;

  & span {
    font-size: 24px;
    font-weight: 800;
  }

  & p {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    opacity: 0.7;
  }

  & svg {
    font-size: 64px;
    color: ${({ theme }) => theme.primary}80;
    margin-bottom: 12px;
  }
`;

export const TaskNotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.text.primary};
  gap: 12px;
  font-family: "Plus Jakarta Sans", sans-serif;
  animation: ${fadeIn} 0.5s ease-out;

  & span {
    font-size: 20px;
    font-weight: 700;
    opacity: 0.9;
  }

  & p {
    font-size: 14px;
    opacity: 0.6;
    margin: 0;
  }

  & svg {
    font-size: 48px;
    color: ${({ theme }) => theme.primary}60;
  }
`;

export const TasksContainer = styled.main`
  display: flex;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 850px) {
    max-width: 100%;
    padding: 0 12px;
  }
`;

export const TimeLeft = styled.span<{ done: boolean }>`
  text-decoration: ${({ done }) => (done ? "line-through" : "none")};
  transition: 0.3s all;
  font-size: 16px;
  margin: 4px 0;
  font-weight: 400;
  display: flex;
  backdrop-filter: none !important;
  @media (max-width: 768px) {
    font-size: 14px;
  }
  // fix for browser translate
  & font {
    margin: 0 1px;
  }
`;

export const SharedByContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const DragHandle = styled.span`
  display: flex;
  align-items: center;
  padding: 6px;
  cursor: grab;
`;

export const Pinned = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  opacity: 0.8;
  font-size: 16px;
`;

export const TaskActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  background: ${({ theme }) =>
    theme.darkmode ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.4)"};
  padding: 16px 24px;
  border-radius: 20px;
  position: sticky;
  top: ${systemInfo.os === "iOS" ? "52" : "60"}px;
  z-index: 50;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => (theme.darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)")};
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.2);

  animation: ${fadeIn} 0.3s ease-in;
  ${({ theme }) => reduceMotion(theme)}

  & h3 {
    margin: 0;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
`;

export const StyledRadio = styled(Checkbox, {
  shouldForwardProp: (prop) => prop !== "clr",
})<{ clr: string }>`
  margin-left: -8px;
  margin-right: 4px;
  color: ${({ clr }) => clr} !important;
  animation: ${fadeIn} 0.3s ease-in;
  &.Mui-checked {
    color: ${({ clr }) => clr} !important;
  }
  ${({ theme }) => reduceMotion(theme)}
`;

const radioIconStyles = css`
  animation: ${scale} 0.2s ease-in;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

export const RadioChecked = styled(RadioButtonChecked)`
  ${radioIconStyles}
  ${({ theme }) => reduceMotion(theme)}
`;

export const RadioUnchecked = styled(RadioButtonUnchecked)`
  ${radioIconStyles}
  ${({ theme }) => reduceMotion(theme)}
`;

export const CategoriesListContainer = styled.div`
  position: sticky;
  background: transparent;
  backdrop-filter: blur(12px);
  z-index: 51;
  top: 0;
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 0;
  margin: 12px 0;
  &::-webkit-scrollbar {
    display: none;
  }
  @media print {
    display: none;
  }
`;

export const HighlightedText = styled.span`
  background-color: #6829ef;
  color: #fff;
  padding: 2px 0;
  border-radius: 4px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  margin: 0;
  font-weight: bold;
  border: 1px solid #ffffff5f;
  transition: 0.3s all;
`;

export const SearchInput = styled(TextField)`
  width: 100%;

  & .MuiOutlinedInput-root {
    padding: 6px 16px;
    border-radius: 20px;
    transition: all 0.3s ease;
    background: ${({ theme }) =>
      theme.darkmode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"};
    color: ${({ theme }) => theme.text.primary};
    border: 1px solid ${({ theme }) => (theme.darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")};

    & svg {
      color: ${({ theme }) => theme.primary};
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    &.Mui-focused {
      background: ${({ theme }) => (theme.darkmode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)")};
      box-shadow: 0 0 0 4px ${({ theme }) => theme.primary}20;
      border-color: ${({ theme }) => theme.primary};
      & svg {
        opacity: 1;
      }
    }
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  @media print {
    display: none;
  }
`;

export const SearchClear = styled(IconButton)`
  animation: ${scale} 0.3s ease;
  transition: 0.3s all;
`;

const ringAnimation = "2s 0.5s ease-in-out infinite";

export const RingAlarm = styled(Alarm, {
  shouldForwardProp: (prop) => prop !== "animate",
})<{ animate?: boolean }>`
  color: red;
  ${({ animate }) =>
    animate &&
    css`
      -webkit-animation: ${ring} ${ringAnimation};
      -moz-animation: ${ring} ${ringAnimation};
      animation: ${ring} ${ringAnimation};
    `}
  @media print {
    color: black !important;
    -webkit-animation: none;
    -moz-animation: none;
    animation: none;
  }
  ${({ theme }) => reduceMotion(theme)}
`;

export const TaskActionsContainer = styled.div`
  @media print {
    display: none;
  }
`;
