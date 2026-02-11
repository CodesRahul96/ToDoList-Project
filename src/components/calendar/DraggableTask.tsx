import { Box, Typography, Paper, Chip } from "@mui/material";
import { Task } from "../../types/user";
import { Priority } from "../../types/user";

interface DraggableTaskProps {
  task: Task;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const DraggableTask = ({ task, onDragStart }: DraggableTaskProps) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set data for RBC
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
    e.dataTransfer.effectAllowed = "copy";
    if (onDragStart) onDragStart(e);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  return (
    <Paper
      draggable
      onDragStart={handleDragStart}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: "12px",
        cursor: "grab",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },
        "&:active": {
            cursor: "grabbing",
        }
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} noWrap>
        {task.name}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Chip 
            label={task.priority || "Normal"} 
            size="small" 
            color={getPriorityColor(task.priority || "low")} 
            variant="outlined" 
            sx={{ height: 20, fontSize: "0.65rem" }}
        />
        {task.category && task.category.length > 0 && (
             <Chip 
                label={task.category[0].name} 
                size="small" 
                variant="outlined" 
                sx={{ height: 20, fontSize: "0.65rem" }}
            />
        )}
      </Box>
    </Paper>
  );
};
