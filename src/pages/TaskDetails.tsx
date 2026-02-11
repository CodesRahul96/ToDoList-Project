import { useParams } from "react-router-dom";
import { CategoryBadge, TopBar } from "../components";
import styled from "@emotion/styled";
import { GlassCard, PathName } from "../styles";
import NotFound from "./NotFound";
import { Clear, Done } from "@mui/icons-material";
import { Emoji } from "emoji-picker-react";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { getColorName } from "ntc-ts";

const TaskDetails = () => {
  const { user } = useContext(UserContext);
  const { tasks, emojisStyle } = user;
  const { id } = useParams();
  const formattedId = id?.replace(".", "");
  const task = tasks.find((task) => task.id.toString().replace(".", "") === formattedId);

  useEffect(() => {
    document.title = `Todo App - ${task?.name || "Task Details"}`;
  }, [task?.name]);

  if (!task) {
    return (
      <NotFound
        message={
          <div>
            Task with id <PathName>{formattedId}</PathName> was not found.
          </div>
        }
      />
    );
  }

  const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <>
      <TopBar title="Task Details" />
      <DetailsWrapper>
        <TaskDetailsCard glow={user.settings.enableGlow}>
          <TaskName>
            Task: <span translate="no">{task.name}</span>
          </TaskName>
          <TaskTable>
            <tbody>
              <TableRow>
                <TableHeader>Emoji:</TableHeader>
                <TableData>
                  {task.emoji ? (
                    <>
                      <Emoji unified={task?.emoji || ""} size={32} emojiStyle={emojisStyle} /> (
                      {task.emoji})
                    </>
                  ) : (
                    <i>none</i>
                  )}
                </TableData>
              </TableRow>
              <TableRow>
                <TableHeader>ID:</TableHeader>
                <TableData>{task?.id}</TableData>
              </TableRow>
              <TableRow>
                <TableHeader>Description:</TableHeader>
                <TableData translate="no">{task?.description || <i>No description provided</i>}</TableData>
              </TableRow>
              <TableRow>
                <TableHeader>Color:</TableHeader>
                <TableData>
                  <ColorSquare clr={task.color} />
                  {getColorName(task.color).name} ({task.color.toUpperCase()})
                </TableData>
              </TableRow>
              <TableRow>
                <TableHeader>Created:</TableHeader>
                <TableData>{dateFormatter.format(new Date(task.date))}</TableData>
              </TableRow>
              {task?.lastSave && (
                <TableRow>
                  <TableHeader>Last edited:</TableHeader>
                  <TableData>{dateFormatter.format(new Date(task.lastSave))}</TableData>
                </TableRow>
              )}
              {task?.deadline && (
                <TableRow>
                  <TableHeader>Task deadline:</TableHeader>
                  <TableData>{dateFormatter.format(new Date(task.deadline))}</TableData>
                </TableRow>
              )}
              <TableRow>
                <TableHeader>Done:</TableHeader>
                <TableData>
                  {task?.done ? <Done color="success" /> : <Clear color="error" />} {task?.done ? "Yes" : "No"}
                </TableData>
              </TableRow>
              <TableRow>
                <TableHeader>Pinned:</TableHeader>
                <TableData>
                  {task?.pinned ? <Done color="primary" /> : <Clear color="disabled" />} {task?.pinned ? "Yes" : "No"}
                </TableData>
              </TableRow>
              {task?.sharedBy && (
                <TableRow>
                  <TableHeader>Shared by: </TableHeader>
                  <TableData>{task.sharedBy}</TableData>
                </TableRow>
              )}
              {task.category && task.category.length > 0 && (
                <TableRow>
                  <TableHeader>Categories:</TableHeader>
                  <TableData>
                    <CategoryContainer>
                      {task?.category?.map((category) => (
                        <CategoryBadge key={category.id} category={category} glow={false} />
                      ))}
                    </CategoryContainer>
                  </TableData>
                </TableRow>
              )}
            </tbody>
          </TaskTable>
        </TaskDetailsCard>
      </DetailsWrapper>
    </>
  );
};

export default TaskDetails;

const DetailsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  min-height: calc(100vh - 100px);
  width: 100%;

  @media (max-width: 600px) {
    padding: 24px 12px;
  }
`;

const TaskDetailsCard = styled(GlassCard)<{ glow: boolean }>`
  max-width: 800px;
  width: 100%;
  box-shadow: ${({ glow, theme }) => (glow ? `0 0 72px -16px ${theme.primary}bf` : "none")};
  border: 1px solid ${({ theme }) => theme.primary}30;
`;

const TaskName = styled.h2`
  margin: 0 0 24px 0;
  text-align: center;
  font-size: 1.8em;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 600px) {
    font-size: 1.5em;
  }
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => (theme.darkmode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")};

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 16px 8px;
  font-size: 1.1em;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  width: 140px;

  @media (max-width: 600px) {
    font-size: 1em;
    padding: 12px 4px;
    width: 110px;
  }
`;

const TableData = styled.td`
  text-align: left;
  padding: 16px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05em;
  word-break: break-all;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 600px) {
    font-size: 0.95em;
    padding: 12px 4px;
  }
`;

const ColorSquare = styled.div<{ clr: string }>`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background-color: ${({ clr }) => clr};
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;
