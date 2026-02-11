import styled from "@emotion/styled";
import { getFontColor } from "../utils";
import { fadeIn, scale } from "./keyframes.styled";
import { Accordion, Button, css, TextField } from "@mui/material";
import { StarOutlineRounded, StarRounded } from "@mui/icons-material";
import { reduceMotion } from ".";

export const CategoriesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const CategoryElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 450px;
  width: 100%;
  background: ${({ theme }) => (theme.darkmode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)")};
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 18px;
  border-radius: 28px;
  border: 1px solid ${({ theme }) => (theme.darkmode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)")};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary}40;
    border-radius: 10px;
  }
`;

export const AddContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  padding: 32px;
  background: ${({ theme }) => (theme.darkmode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)")};
  border-radius: 32px;
  border: 1px solid ${({ theme }) => (theme.darkmode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)")};
`;

export const CategoryElement = styled.div<{ clr: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 8px 0;
  padding: 14px 20px;
  border-radius: 20px;
  background: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColor(clr)};
  animation: ${fadeIn} 0.5s ease-in-out;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    padding: 12px 16px;
  }

  ${({ theme }) => reduceMotion(theme)}
`;

export const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 4px;
  gap: 4px;
`;

export const ActionButton = styled.div`
  /* background: #ffffffcd; */
  background: ${({ theme }) => (theme.darkmode ? "#000000cd" : "#ffffffcd")};
  border-radius: 100%;
`;
export const CategoryInput = styled(TextField)`
  margin: 12px 0;
  width: 100%;

  .MuiOutlinedInput-root {
    border-radius: 16px;
    color: ${({ theme }) => getFontColor(theme.secondary)};
  }
  & .MuiFormHelperText-root {
    color: ${({ theme }) => getFontColor(theme.secondary)};
    opacity: 0.8;
  }
`;

export const EditNameInput = styled(TextField)`
  margin-top: 12px;
  width: 100%;
  .MuiOutlinedInput-root {
    border-radius: 16px;
  }
`;

export const AddCategoryButton = styled(Button)`
  border: none;
  padding: 16px 32px;
  font-size: 20px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => getFontColor(theme.primary)};
  border-radius: 20px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 16px;
  width: 100%;
  text-transform: none;
  box-shadow: ${({ theme }) => `0 8px 20px -6px ${theme.primary}60`};

  &:hover {
    box-shadow: ${({ theme }) => `0 12px 25px -6px ${theme.primary}80`};
    background: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.6;
    background: ${({ theme }) => (theme.darkmode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")};
  }
`;

export const AssociatedTasksAccordion = styled(Accordion)`
  margin: 16px 0;
  background: transparent;
  box-shadow: none;
  border: 2px solid ${({ theme }) => `${theme.darkmode ? "#ffffff" : "#000000"}5a`};
  border-radius: 12px !important;
`;

const StarIconStyles = css`
  animation: ${scale} 0.2s ease-in;
`;

export const StarChecked = styled(StarRounded)`
  ${StarIconStyles}
  ${({ theme }) => reduceMotion(theme)}
`;

export const StarUnchecked = styled(StarOutlineRounded)`
  ${StarIconStyles}
  ${({ theme }) => reduceMotion(theme)}
`;
