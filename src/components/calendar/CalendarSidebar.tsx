import { Box, Typography, Button, Divider, useTheme } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { Task } from "../../types/user";
import { DraggableTask } from "./DraggableTask";

interface CalendarSidebarProps {
  tasks: Task[];
  onAddTask: () => void;
  onDragStart: (task: Task) => void;
}

export const CalendarSidebar = ({ tasks, onAddTask, onDragStart }: CalendarSidebarProps) => {
  const theme = useTheme();

  // Filter for unscheduled tasks (no deadline or invalid deadline)
  const unscheduledTasks = tasks.filter(t => {
      if (t.done) return false;
      if (!t.deadline) return true;
      // Check if deadline is valid
      const date = new Date(t.deadline);
      return isNaN(date.getTime());
  });
  
  return (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        p: 2,
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddRounded />}
        onClick={onAddTask}
        fullWidth
        sx={{ 
            borderRadius: "12px", 
            mb: 3, 
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            boxShadow: `0 4px 14px 0 ${theme.palette.primary.main}40`
        }}
      >
        Add New Task
      </Button>

      <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 2, px: 1 }}>
        Unscheduled ({unscheduledTasks.length})
      </Typography>
      
      <Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {unscheduledTasks.length > 0 ? (
          unscheduledTasks.map(task => (
            <DraggableTask key={task.id} task={task} onDragStart={() => onDragStart(task)} />
          ))
        ) : (
          <Typography variant="body2" color="text.disabled" align="center" sx={{ mt: 4 }}>
            No unscheduled tasks
          </Typography>
        )}
      </Box>
    </Box>
  );
};
